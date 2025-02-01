//const fs = require("fs");
import fs from "node:fs";  // "type": "module" in package.json

//To read file content using blocking code
console.log("Starting to read");
const buffer1 = fs.readFileSync("data.txt");
console.log(buffer1.toString());

const buffer2 = fs.readFileSync("data.txt", { encoding: "utf-8" });
console.log(buffer2);

console.log("This is another operation being performed");
