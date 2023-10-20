const mongoose = require("mongoose");

module.exports = mongoose
  .connect("mongodb://127.0.0.1:27017/socialmedia_db")
  .then(() => console.log("MongoDB connect"))
  .catch((error) => console.log("MongoDB error when connecting 🔥🔥", error));
