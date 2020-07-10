const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "ChatConnect Bot";

// use static folder
app.use(express.static(path.join(__dirname, "public")));

// when a client connects
io.on("connection", (socket) => {
  //console.log("New web socket connection");
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    //socket.emit("message", "Welcome to the chatting application");
    socket.emit(
      "message",
      formatMessage(botName, "Welcome to the chatting application")
    );

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} joined the chat`)
      );
  });

  // Listen for chat message
  socket.on("chatmessage", (msg) => {
    //console.log(msg);
    io.emit("message", formatMessage("USER", msg));
  });

  // when a user disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
