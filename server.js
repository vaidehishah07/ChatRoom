const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "ChatConnect Bot";

// use static folder
app.use(express.static(path.join(__dirname, "public")));

// when a client connects
io.on("connection", (socket) => {
  //console.log("New web socket connection");

  // Welcome current user
  //socket.emit("message", "Welcome to the chatting application");
  socket.emit(
    "message",
    formatMessage("botName", "Welcome to the chatting application")
  );

  // Broadcast when a user connects
  socket.broadcast.emit("message", "A user joined the chat");

  // when a user disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  // Listen for chat message
  socket.on("chatmessage", (msg) => {
    //console.log(msg);
    io.emit("message", msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));