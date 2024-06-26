const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Route to welcome message
app.get("/", (req, res) => {
  res.send("Welcome to your File Server");
});

// Route to list all files in the ./files/ directory
app.get("/files", (req, res) => {
  fs.readdir("files", (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error reading directory" });
    }
    res.status(200).json(files);
  });
});

// Route to get a specific file content by filename
app.get("/file/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = `./files/${fileName}`;

  fs.readdir("files", (err, files) => {
    if (err) {
      return res.status(500).send("Error reading directory");
    }

    if (files.includes(fileName)) {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          if (err.code === "ENOENT") {
            return res.status(404).send("File not found");
          }
          return res.status(500).send("Error reading file");
        }
        res.status(200).send(data);
      });
    } else {
      res.status(404).send("File not found");
    }
  });
});

// Catch-all route for handling invalid routes
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start the server
// app.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });

module.exports = app;
