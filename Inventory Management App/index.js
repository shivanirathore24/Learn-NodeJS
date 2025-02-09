const express = require("express");
const path = require("path");

const server = express();
const PORT = 3100;
server.use(express.static("src/views"));

//Here, we ware sending html file directly, next we will use controller as an intermediate.
server.get("/", (req, res) => {
  res.sendFile(path.join(path.resolve(), "src", "views", "products.html"));
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
