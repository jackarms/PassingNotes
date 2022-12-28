const users = [];

function userJoin(id, userName, chatRoom) {
  const user = { id, userName, chatRoom };

  users.push(user);

  return user;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(chatRoom) {
  return users.filter((user) => user.chatRoom === chatRoom);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
