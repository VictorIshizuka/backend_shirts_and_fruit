const bcrypt = require("bcryptjs");

const users = [
  {
    username: "Admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("12345", 10),
    isAdmin: true,
  },
  {
    username: "Client",
    email: "cliente@gmail.com",
    password: bcrypt.hashSync("12345", 10),
    isAdmin: false,
  },
];
module.exports = users;
