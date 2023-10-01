const express = require("express");
const path = require("path");
const port = 8000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

contactList = [
  {
    name: "Shivani",
    phone: 9999999999,
  },
  {
    name: "Neeraj",
    phone: 8888888888,
  },
  {
    name: "Shubman",
    phone: 1234567890,
  },
];

app.get("/", function (req, res) {
  return res.render("home", {
    title: "Contact List",
    contact_list: contactList,
  });
});

app.listen(port, function (err) {
  if (err) {
    console.log("Error is running the server", err);
  }
  console.log("My Express server is running on port", port);
});
