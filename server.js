const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const bot = "Passing Notes Bot";

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ userName, chatRoom }) => {
    const user = userJoin(socket.id, userName, chatRoom);
    socket.join(user.chatRoom);
    socket.emit("message", formatMessage(bot, "Welcome to Passing Notes 🤫"));

    socket.broadcast
      .to(user.chatRoom)
      .emit(
        "message",
        formatMessage(bot, `${user.userName} has joined the chat!`)
      );
  });

  socket.on("note", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.chatRoom).emit("message", formatMessage(user.userName, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.chatRoom).emit(
        "message",
        formatMessage(bot, `${user.userName} has left the chat.`)
      );
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
