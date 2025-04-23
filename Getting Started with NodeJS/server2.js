/* Handling multiple request */

// 1. Import http library/module
const http = require("http");

// 2. Create Server
const server = http.createServer((req, res) => {
  console.log(req.url);
  res.write("Welcome to my application! \n");

  if (req.url == "/product") {
    return res.end("This is Product Page"); //to end response use "return"
  } else if (req.url == "/user") {
    return res.end("This is User Page!");
  }

  //Here comes the request
  res.end("Welcome to NodeJS Server !");
});

// 3. Specify a port to listen to client's requests
server.listen(3100, () => {
  console.log("Server is listening on port 3100!");
});
