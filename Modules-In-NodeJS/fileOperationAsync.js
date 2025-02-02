//const fs = require("fs");
import fs from "node:fs"; // "type": "module" in package.json

//Reading data
fs.readFile("data.txt", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data.toString());
  }
});

//Write data
fs.writeFile("employee.txt", "New Employee", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("File is written");
  }
});

//Append data
fs.appendFile("employee.txt", "\n Another Employee", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("File is updated");
  }
});

//Delete data
/*
fs.unlink("employee.txt", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("File is deleted");
  }
});
*/

console.log("This is another operation");
