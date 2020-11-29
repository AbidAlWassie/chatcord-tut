const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utilities/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "ChatCord Bot";

// Set static directory
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", socket => {
  
  // Welcome current user
  socket.emit("message", formatMessage(botName,"Welcome to ChatCord!"));
  
  // Broadcast when a user connects
  socket.broadcast.emit("message", formatMessage(botName, "A user has joined the chat"));
  
  //Run when a client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "a user has left the chat"));
  });
  
  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
    // console.log(msg);
  });
});


const PORT = 3000 || process.env.PORT;
// const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

