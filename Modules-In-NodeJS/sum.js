// 1.Import readline using CommonJS syntax
//const readline = require("readline");
/*
If you prefer to use CommonJS syntax (require), then either:
Remove "type": "module" from package.json
OR rename sum.js to sum.cjs
*/

// 1. Import readline using ES module syntax
import readline from "node:readline";

// 2. Configure interface to connect with terminal/ command line
const interface1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 3. Reading values
interface1.question("Enter first number", (num1) => {
  interface1.question("Enter second number", (num2) => {
    // num1, num2
    const sum = Number(num1) + Number(num2);
    console.log(sum);
  });
});
