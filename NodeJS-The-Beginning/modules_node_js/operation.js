/*
1- Simple or complex functionality organized in a single or multiple JavaScript files 
which can be reused throughout your Node.js application is called modules.
2- Node.js modules are made available externally using module.exports
 */

module.exports.add = function (a, b) {
  return a + b;
};

exports.multiply = function (a, b) {
  return a * b;
};

var divide = function (a, b) {
  return b / a;
};
