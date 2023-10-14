const express = require("express");
const app = express(); //to get all fucntionalities of express libraries to run server
const port = 8000;

app.listen(port, function (err) {
  if (err) {
    console.log(`Error: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
