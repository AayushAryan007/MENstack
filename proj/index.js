const express = require("express");
const app = express();
const path = require("path");
//parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index");
});

app.get("profile/:username", function (req, res) {
  const username = req.params.username;
  res.render("profile", { username: username });
});

app.listen(3000, function () {
  console.log("Server is running on http://localhost:3000");
});
