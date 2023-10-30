require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());

const users = [];

const posts = [
  {
    username: "Tom",
    title: "Hello Express Js",
  },
  {
    username: "Jerry",
    title: "Hello Javascript",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  console.log(res);
  res.json(posts.filter((post) => post.username === req.user.name));
});

//fetch registered users

app.get("/users", (req, res) => {
  res.json(users);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);
