const express = require("express");

//Create a server
const server = express();

//Middlware
server.get("/", (req, res, next) => {
  console.log(" First middlware hit");
  next();
});

//GET Request
server.get("/", (req, res) => {
  res.send("Welcome to Express Server");
});

//POST Request
server.post("/", (req, res) => {
  res.send("Post request recieved");
});

//PUT Request
server.put("/", (req, res) => {
  res.send("Put request recieved");
});

//DELETE Request
server.delete("/", (req, res) => {
  res.send("Delete request recieved");
});

//Listen on specified port
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
