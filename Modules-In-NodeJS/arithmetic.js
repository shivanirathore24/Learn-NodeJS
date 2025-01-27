/* CommonJS Module */
//Way-1
module.exports.sum = (x, y) => {
  return x + y;
};

//way-2
function div(x, y) {
  return x / y;
}

module.exports = {
  divide: div,
};

//way-3
module.exports = function (x, y) {
  return x + y;
};

console.log("Loading arithmetic...");


