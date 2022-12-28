const users = [];

function userJoin(id, userName, chatRoom) {
  const user = { id, userName, chatRoom };

  users.push(user);

  return user;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

module.exports = { userJoin, getCurrentUser };
