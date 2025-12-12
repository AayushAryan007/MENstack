const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/usermodule");

const userSchema = new mongoose.Schema({
  name: String,
  userName: String,
  email: String,
});

module.exports = mongoose.model("User", userSchema);
