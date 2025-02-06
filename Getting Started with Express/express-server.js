const express = require("express");

//Create a server
const server = express();

//Handle default request
server.get("/", (req, res) => {
  res.send("Welcome to Express Server");
});

//Listen on specified port
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
