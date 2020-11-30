const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utilities/messages");
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require("./utilities/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "ChatCord Bot";

// Set static directory
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", socket => {
  
  socket.on("joinRoom", ({username, room}) => {
    
    const user = userJoin(socket.id, username , room);
    
    socket.join(user.room);
    
    // Welcome current user
    socket.emit("message", formatMessage(botName,"Welcome to ChatCord!"));
  
    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`));
  });
  
  //Run when a client disconnects
  socket.on("disconnect", () => {
    
    const user = userLeave(socket.id);
    
    if(user) {
      io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));
    }
    
  });
  
  // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);
      
      io.to(user.room).emit("message", formatMessage(user.username, msg));
      // console.log(msg);
  });
  
});


const PORT = 8080 || process.env.PORT;
// const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

