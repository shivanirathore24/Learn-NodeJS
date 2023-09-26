/*
1- npm install express : to install express.js , that will add node_modules folder and package-lock.json file.
2- 'node_modules' folder contains libraries that Node.js requires.
3- Express.Js is fase unopionated minimalist Node.js web application framework.
4- Features of ExpressJS: 
    -allows to setup middlewares to respond to HTTP requests.
    -defines routing table which can work as per HTTP method and URL.
    -dynamically renders HTML Pages.
*/

//setting up express server
const express = require("express");
const port = 8000;

const app = express();

app.listen(port, function (err) {
  if (err) {
    console.log("Error is running the server", err);
  }
  console.log("My Express server is running on port", port);
});


//returning response from server
app.get("/", function (req, res) {
  res.send("<h1>Cool, it's running ! or is it? </h1>");
});
//localhost:8000 - Cool, it's running ! or is it?

app.get("/profile", function (req, res) {
  res.send("<h1>Getting Profile data ! </h1>");
});
//localhost:8000/profile - Getting Profile data !
