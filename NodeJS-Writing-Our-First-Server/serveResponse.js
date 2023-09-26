/*  Run our server on port 8000 */

//To use the HTTP server in the node, we need to require the HTTP module. The HTTP module creates an HTTP server
//that listens to server ports and gives a response back to the client. Syntax: const http = require('http');
const http = require("http");
const port = 8000;

//serving a response to the browser
function requestHandler(req, res) {
  console.log(req.url);
  res.end("Gotcha");
}

const server = http.createServer(requestHandler);
server.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Server is up and running on port:", port);
});

/*
1- npm init : command will be used to set up a new or existing package.
2- package.json contains the metadata and project dependencies of Node project
3- We can run multiple Node.js servers on a single machine.
4- var http = require("http"); will create an instance of HTTP module in Node.js file.
*/
