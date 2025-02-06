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
  // Setting a response header
  res.set("Content-Type", "text/plain");
  res.send("Welcome to Express Server");
});

//POST Request
server.post("/", (req, res) => {
  // Setting status code
  res.status(201).send("Post request recieved");
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
