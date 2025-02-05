const http = require("http");

const server = http.createServer((req, res) => {
  res.write("This is coming from NodeJS Server.");

  //Way-1
  if (req.url == "/first") {
    return res.end("This is first response");
  }
  res.end("This is default response");

  //Way-2
  /*
  if (req.url == "/first") {
    res.end("This is first response");
  } else {
    res.end("This is default response");
  }*/
});

server.listen(3000, (req, res) => {
  console.log("Server is listening at 3000");
});

/*
In Way-1, return is used to stop further execution i.e immediately exits the function after calling res.end(), 
preventing multiple responses. Without return, "This is default response" would also be sent, causing an error.
In Way-2, if-else ensures that only one res.end() executes, making return unnecessary.

Use return when you want to stop execution manually.
Use if-else for clear response logic without needing return.
*/
