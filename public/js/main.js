//const users = require("../../utils/users");

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const socket = io();
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//console.log(username, room);

// join chatrrom
socket.emit("joinRoom", { username, room });

//Get the room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Msg from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //to scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  // Emit msg to server
  socket.emit("chatmessage", msg);

  //clear the input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.textMessage}
  </p> `;

  document.querySelector(".chat-messages").appendChild(div);
}

//Add roomname to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}
