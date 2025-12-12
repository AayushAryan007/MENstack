const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { log } = require("console");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(`files`, (err, files) => {
    if (err) return res.render("index", { title: "Home Page", files: [] });

    const snippets = {};
    files.forEach((fname) => {
      try {
        const content = fs.readFileSync(
          path.join(__dirname, "files", fname),
          "utf8"
        );
        const first = content.slice(0, 15);
        snippets[fname] = first + (content.length > 15 ? "..." : "");
      } catch (e) {
        snippets[fname] = "";
      }
    });

    res.render("index", { title: "Home Page", files, snippets });
  });
});

app.post("/create", (req, res) => {
  // console.log(req.body);
  fs.writeFile(
    `files/${req.body.title.split(" ").join("")}.txt`,
    req.body.description,
    (err) => {
      if (err) {
        log(err);
      } else {
        res.redirect("/");
      }
    }
  );
});

app.get("/files/:name", (req, res) => {
  const safeName = req.params.name.replace(/[^a-zA-Z0-9-_]/g, "");
  const filePath = path.join(__dirname, "files", `${safeName}.txt`);

  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) {
      return res.status(404).send("Task not found");
    }
    res.render("show", {
      title: safeName,
      content,
      status: "Pending",
    });
  });
});

app.get("/files/:name/edit", (req, res) => {
  const safeName = req.params.name.replace(/[^a-zA-Z0-9-_]/g, "");
  const filePath = path.join(__dirname, "files", `${safeName}.txt`);

  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) return res.status(404).send("Task not found");
    res.render("edit", { title: safeName, content });
  });
});

app.post("/files/:name/edit", (req, res) => {
  const safeName = req.params.name.replace(/[^a-zA-Z0-9-_]/g, "");
  const filePath = path.join(__dirname, "files", `${safeName}.txt`);
  const updated = req.body.description || "";

  fs.writeFile(filePath, updated, (err) => {
    if (err) return res.status(500).send("Failed to save");
    res.redirect(`/files/${encodeURIComponent(safeName)}`);
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
