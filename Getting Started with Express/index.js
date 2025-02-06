const express = require("express");

//Server
const server = express();

server.get("/", (req, res) => {
  return res.send("Welcome to express");
});

//Static files are in public folder which can be accessed directly
server.use(express.static("public"));

server.listen(3000);
console.log("Server is listening on port 3000");
