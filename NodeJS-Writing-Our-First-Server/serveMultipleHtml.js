// Run our server on port 8000
const http = require("http");
const port = 8000;
//The Node.js file system module allows you to work with the file system on your computer.
const fs = require("fs");

//serving a response to the browser
function requestHandler(req, res) {
  console.log(req.url);
  res.writeHead(200, { "content-type": "text/html" });

  let filePath;
  switch (req.url) {
    case "/":
      filePath = "./index.html";
      break;
    case "/profile":
      filePath = "./profile.html";
      break;
    default:
      filePath = "./error.html";
  }

  //reading and serving HTML from a file
  fs.readFile(filePath, function (err, data) {
    if (err) {
      console.log("error", err);
      return res.end("<h1> Error! </h1>");
    }
    return res.end(data);
  });
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
"nodemon" is a tool that helps develop node js based applications by automatically restarting the node application 
when file changes in the directory are detected.
Installed using command : npm install -g nodemon
*/
