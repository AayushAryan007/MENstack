const express = require("express");
const app = express();
const userModel = require("./usermodel");
app.get("/", (req, res) => {
  res.send("Hello, fyiWorld!");
});

app.get("/create", async (req, res) => {
  let createdUser = await userModel.create({
    name: "John Doe",
    userName: "johndoe",
    email: "a@gmail.com",
  });

  res.send(createdUser);
  console.log("User created");
  // sync -> async (consolde pehle chalega without async await)
});

app.get("/update", async (req, res) => {
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { userName: "johndoe" },
      { name: "Jane Doe" },
      { new: true } // return updated doc
    );
    if (!updatedUser) return res.status(404).send("User not found");
    console.log("User updated");
    res.send(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
  }
});

app.get("/read", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Read failed");
  }
});

app.get("/delete", async (req, res) => {
  try {
    const deletedUser = await userModel.findOneAndDelete({
      userName: "johndoe",
    });
    if (!deletedUser) return res.status(404).send("User not found");
    console.log("User deleted");
    res.send(deletedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete failed");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
