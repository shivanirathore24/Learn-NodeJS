const express = require("express");
const app = express(); //to get all functionalities of express libraries to run server
const port = 8000;

/*** use express router ***/
app.use("/", require("./routes"));

/*** Setup View Engine (EJS) */
app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, function (err) {
  if (err) {
    console.log(`Error: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
