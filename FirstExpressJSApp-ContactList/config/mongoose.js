//require the library
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/contactlist_db")
  .then(() => console.log("MongoDB connect"))
  .catch((error) => console.log("MongoDB error when connecting 🔥🔥", error));

/*
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/contactlist_db");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// //acquire the connection ( to check if it's successful)
const db = mongoose.connection;

//up and running then print the message
db.once("open", function () {
  console.log("Successfully connected to the database");
});
*/
