const express = require("express");
const app = express(); //to get all functionalities of express libraries to run server
const port = 8000;

//write before express router, becoz views are going tp be render which have layouts.
const expressLayout = require("express-ejs-layouts");
app.use(expressLayout);

/*** Setup static assets ***/
app.use(express.static("./assets"));

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
