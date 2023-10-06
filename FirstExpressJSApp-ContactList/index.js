const express = require("express");
const path = require("path");
const port = 8000;

const db = require("./config/mongoose");
const Contact = require("./models/contact");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//Parser takes the data from browser and creates body key inside request object, addes data inside body.
app.use(express.urlencoded()); //signifies middleware, reads only form data which was submitted, not params
app.use(express.static("assets"));

contactList = [
  {
    name: "MS Dhoni",
    phone: 7777777777,
  },
  {
    name: "Shivani Rathore",
    phone: 9999999999,
  },
  {
    name: "Neeraj Chopra",
    phone: 8888888888,
  },
  {
    name: "Shubman Gill",
    phone: 1234567890,
  },
];

//Getting data from database
app.get("/", function (req, res) {
  Contact.find({})
    .then((contacts) => {
      return res.render("home", {
        title: "Contact List",
        contact_list: contacts,
      });
    })
    .catch((err) => {
      console.log("Error in fetching contacts from db", err);
    });
});

// app.get("/", async function (req, res) {
//   try {
//     const contacts = await Contact.find({ name: "Shivani" }); //this will show only Shivani name Contact
//     return res.render("home", {
//       title: "Contact List",
//       contact_list: contacts,
//     });
//   } catch (err) {
//     console.log("Error in fetching contacts from db", err);
//   }
// });

//Posting data to database
app.post("/create-contact", async function (req, res) {
  try {
    const newContact = await Contact.create({
      name: req.body.name,
      phone: req.body.phone,
    });

    console.log("New contact:", newContact);
    return res.redirect("back");
  } catch (err) {
    console.error("Error in creating a contact:", err);
    return res.status(500).send("Internal Server Error"); // Handle the error gracefully
  }
});

//Deleting from Database
app.get("/delete-contact/", function (req, res) {
  let id = req.query.id; // Get the id from the query in the URL
  Contact.findByIdAndDelete(id) // Find the contact in the database using id and delete
    .then(() => {
      return res.redirect("back");
    })
    .catch((err) => {
      console.log("Error in deleting an object from the database", err);
      // Handle the error here, such as sending an error response
      return res.status(500).send("Internal Server Error");
    });
});

/* OR
app.get("/delete-contact/", async function (req, res) {
  try {
    // Get the id from the query in the URL
    let id = req.query.id;

    // Find the contact in the database using id and delete
    await Contact.findByIdAndDelete(id);
    return res.redirect("back");
  } catch (err) {
    console.log("Error in deleting an object from the database", err);
    // Handle the error here, such as sending an error response
    return res.status(500).send("Internal Server Error");
  }
});
*/

app.listen(port, function (err) {
  if (err) {
    console.log("Error is running the server", err);
  }
  console.log("My Express server is running on port:", port);
});
