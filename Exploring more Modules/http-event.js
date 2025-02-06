const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    // console.log(req.body);  //undefined
    //expecting data from client
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      console.log("Data recieved:", body);
      //Perform further actions with the recieved data
      res.end("Data recieved succesfully");
    });
  } else {
    res.end("Welcome to Node JS");
  }
});
server.listen(3100);
console.log("Server listening on port 3100");
