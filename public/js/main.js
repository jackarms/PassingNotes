const e = require("express");

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const { userName, chatRoom } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit("joinRoom", { userName, chatRoom });

socket.on("message", (message) => {
  displayMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const msg = event.target.elements.msg.value;

  socket.emit("note", msg);

  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
});

const displayMessage = (message) => {
  const divEl = document.createElement("div");
  divEl.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p>
  <p class="text">
    ${message.txt}
  </p>`;
  document.querySelector(".chat-messages").appendChild(divEl);
};
