const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

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

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.get("/login", (req, res) => {
  //Authenticate User
});

//fetch registered users

app.get("/users", (req, res) => {
  res.json(users);
});

//registering a user

app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(salt);
    console.log(hashedPassword);

    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => (user.name = req.body.name));
  if (user == null) {
    return res.status(400).send("User not found");
  }
  try {
    const isPswdCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPswdCorrect) {
      res.send("Success");
    } else {
      res.send("Incorrect Credentials");
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(3000);
