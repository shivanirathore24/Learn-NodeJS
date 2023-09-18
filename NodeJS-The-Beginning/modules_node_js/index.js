/* require(): function is used to include modules and libraries in Node Js */
const operations = require("./operation");

/* Here 'operations.js' acts as library consisting of set of reusable functions */
console.log(operations.add(2, 3)); //5
console.log(operations.multiply(2, 4)); //8
console.log(operations.divide(2, 8)); //TypeError: operations.divide is not a function , not accesible
