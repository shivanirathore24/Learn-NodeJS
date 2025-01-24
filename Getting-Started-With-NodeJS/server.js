//Create a server using NodeJS

// 1. Import http library/module
const http = require("http");

// 2. Create Server
const server = http.createServer((req, res) => {
  console.log(req.url);
  res.write("Welcome to my application! ");
  if (req.url == "/product") {
    res.end("This is Product Page!");
    //return res.end("This is Product Page"); //to end response use "return"
  } else if (req.url == "/user") {
    res.end("This is User Page!");
  }
  //Here comes the request
  res.end("Welcome to NodeJS Server");
});

// 3. Specify a port to listen to client's requests
server.listen(3100, () => {
  console.log("Server is listening on port 3100!");
});

//console.log("Server is listening on port 3100!")
