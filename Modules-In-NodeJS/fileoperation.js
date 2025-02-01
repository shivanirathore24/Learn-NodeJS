//const fs = require("fs");
import fs from "node:fs"; // "type": "module" in package.json

//To read file content using blocking code
console.log("Starting to read");
const buffer1 = fs.readFileSync("data.txt");
console.log(buffer1.toString());

const buffer2 = fs.readFileSync("data.txt", { encoding: "utf-8" });
console.log(buffer2);

//Creating and writing a file
try {
  fs.writeFileSync(
    "employee.txt",
    "Name: John Doe, Age: 37, Position: Manager"
  );
} catch (err) {
  console.log(err);
}

//Append another employee data
fs.appendFileSync("employee.txt", " Name: David Doe, Age: 49, Position: COO");

//Deleting a file
try {
  fs.unlinkSync("employee.text"); //using wrong filename
} catch (err) {
  console.log("File doesn't exist");
}

console.log("This is another operation being performed");
