const express = require("express");
const path = require("path");
const port = 8000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//Praser takes the data from browser and creates body key inside request object, addes data inside body.
app.use(express.urlencoded()); //signifies middleware

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

app.get("/practice", function (req, res) {
  return res.render("practice", {
    title: "Let us play with ejs",
  });
});

//Controller : create-contact
app.post("/create-contact", function (req, res) {
  //as soon you kill the server, re-start the page so your Added Contact through form will get vanished becoz compiled file was
  //saved in RAM andn will be removed from the memmory. Only hard-coded value will be there i.e SHivani, Neeraj, Shubman.
  contactList.push(req.body);

  return res.redirect("back"); //go back to page from which it was coming
});

/* OR
app.post("/create-contact", function (req, res) {
  console.log(req.body);
  console.log(req.body.name);
  console.log(req.body.phone);

  contactList.push({
    name: req.body.name,
    phone: req.body.phone,
  });

  return res.redirect("/");
});
*/

app.listen(port, function (err) {
  if (err) {
    console.log("Error is running the server", err);
  }
  console.log("My Express server is running on port", port);
});
