require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());

const users = [];
let refreshTokens = []; // save to database instead

// token
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

// delete token
app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});


// registering a user

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

// user authentication

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
      // jwt authentication
      const accessUser = { name: req.body.name };
      const accessToken = generateAccessToken(accessUser);
      const refreshToken = jwt.sign(user, process.env.SECRET_REFRESH_TOKEN);
      refreshTokens.push(refreshToken);
      res.json({
        message: "success",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      res.send("Incorrect Credentials");
    }
  } catch {
    res.status(500).send();
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "15s" });
}

app.listen(4000);
