const express = require("express");

//Create a server
const server = express();

//Middlewares
function firstMiddleware(req, res, next) {
  console.log("This is first middleware");
  next();
}

function secondMiddleware(req, res, next) {
  console.log("This is second middleware");
  next();
}

function globalMiddlware(req, res, next) {
  console.log("This is application-level middlware");
  next();
}
//This middleware going to be excuted for all requests
server.use(globalMiddlware);

// server.get("/", firstMiddleware, secondMiddleware, (req, res) => {
//   res.send("Hello world! This is express server");
// });

//Route-level middlewares going to be excuted for send requests
server.get("/send", [firstMiddleware, secondMiddleware], (req, res) => {
  res.send("Hello world! This is express server");
});

//Listen on specified port
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
