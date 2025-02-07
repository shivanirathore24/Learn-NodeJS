const express = require("express");
const server = express();
const PORT = 3000;

server.get("/", (req, res) => {
  res.send("Welcome to Inventory App");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
