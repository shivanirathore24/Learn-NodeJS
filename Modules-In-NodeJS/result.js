//call arithemetic functions, get result and print result on terminal

//how to import a module
const arithmeticModule = require("./arithmetic");

//call sum function
// const result1 = arithmeticModule.sum(10, 20);
// console.log(result1); //30

// const result2 = arithmeticModule.divide(20, 10);
// console.log(result2); // 2

const result3 = arithmeticModule(20, 30);
console.log(result3);

/*
module.exports has been overwritten multiple times, and only the last assignment
(module.exports = function(x, y) { ... }) is retained. This leads to the following issues:
arithmetic.sum and arithmetic.divide will not exist.
arithmetic itself becomes a function (due to Way-3), and trying to access .sum or .divide will result in an error.
*/
