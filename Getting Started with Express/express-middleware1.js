const express = require("express");

//Create a server
const server = express();

//Handle default request
//Way-1
server.get("/", (req, res, next) => {
  //middleware
  console.log("First middleware hit");
  next();
});

server.get("/", (req, res) => {
  res.send("Hello world! This is express server");
});

//Way-2
/*
server.get(
  "/",
  (req, res, next) => {
    // 1st middleware
    console.log("First middleware hit");
    next();
    //res.send("This is from 1st middleware");
  },
  // 2nd middleware
  (req, res) => {
    res.send("Hello world! This is express server");
  }
);
*/

//Listen on specified port
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
