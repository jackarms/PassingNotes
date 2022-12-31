const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const User = require("./models/User");
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

mongoose.connect("mongodb://127.0.0.1/passingNotes");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

app.get("/roomPick", (req, res) => {
  res.render("roomPick");
});

app.get("/signUp", (req, res) => {
  res.render("signUp");
});

app.post("/signUp", (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  newUser.save();

  console.log(newUser);
});

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

    io.to(user.chatRoom).emit("roomUsers", {
      room: user.chatRoom,
      users: getRoomUsers(user.chatRoom),
    });
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

      io.to(user.chatRoom).emit("roomUsers", {
        room: user.chatRoom,
        users: getRoomUsers(user.chatRoom),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
