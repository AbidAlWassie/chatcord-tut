const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static directory
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", socket => {
  // console.log("New WS Connection...");
  
  socket.emit("message", "Welcome to ChatCord!");
  
  // Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");
  
  //Run when a client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "a user has left the chat");
  });
  
  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
    // console.log(msg);
  });
});


const PORT = 3000 || process.env.PORT;
// const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

