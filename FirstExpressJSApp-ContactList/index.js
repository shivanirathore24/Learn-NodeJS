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

/* 
1.Middleware functions are functions that have access to the request object (req), the response object (res), and the next
  function in the application’s request-response cycle. The next function is a function in the Express router which, when
  invoked, executes the middleware succeeding the current middleware.
2.Middleware functions can perform the following tasks:
  - Execute any code.
  - Make changes to the request and the response objects.
  - End the request-response cycle.
  - Call the next middleware in the stack.
3.Before the controller, all the middlewares get executed in chronological order. 
  So first middleware-1 is called. But if we haven’t called the next() function in it, the next middleware doesn’t get triggered.
  Then, only “middleware 1 is called” is printed.
*/

//middleware-1
app.use(function (req, res, next) {
  //console.log('middleware-1 is called');
  req.name = "Shiv";
  next();
});

//middleware-2
app.use(function (req, res, next) {
  //console.log("middlware-2 is called");
  console.log("My name from MW2: ", req.name);
  next();
});

app.get("/", function (req, res) {
  console.log("from get from route controller", req.name);
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
  //as soon you kill the server, re-start the page, so your already Added-Contact through form will get vanished becoz compiled file
  //was saved in RAM and will be removed from the memmory. Only hard-coded value will be there i.e Shivani, Neeraj, Shubman.
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
