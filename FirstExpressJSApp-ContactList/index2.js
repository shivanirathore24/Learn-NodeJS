const express = require("express");
const path = require("path");
const port = 8000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
  console.log(__dirname);
  return res.render("home", { title: "Contact List" });
});

app.get("/practice", function (req, res) {
  return res.render("practice", { title: "Let's play with EJS" });
});

app.listen(port, function (err) {
  if (err) {
    console.log("Error is running the server", err);
  }
  console.log("My Express server is running on port", port);
});

/* 
1- __dirname gives the the directory name of the current module.
2- <%= x %> prints the value of x into the ejs template (HTML)
*/
