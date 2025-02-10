import express from "express";
import ProductController from "./src/controllers/product.controller.js";
import ejsLayouts from "express-ejs-layouts";
import path from "path";

const server = express();
const PORT = 3100;

//Setup view engine settings
server.set("view engine", "ejs");
server.set("views", path.join(path.resolve(), "src", "views"));

server.use(ejsLayouts);

//Serves the static files from the views directory to the browser
server.use(express.static("src/views"));

//Create an instance of ProductController
const productController = new ProductController();
server.get("/", productController.getProducts);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});