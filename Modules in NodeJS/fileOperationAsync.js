//import fs from "node:fs"; // "type": "module" in package.json
const fs = require("fs");
const path = require("path");

//Reading data
const filePath = path.join("src", "home", "data.txt");
const filePathResolved = path.resolve("src", "home", "data.txt");
console.log(filePath);
console.log(filePathResolved); //get absolute path
console.log(path.extname(filePathResolved));

fs.readFile(filePathResolved, (err, data) => {
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
