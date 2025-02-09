import express from "express";
import ProductController from "./src/controllers/product.controller.js";

const server = express();
const PORT = 3100;
server.use(express.static("src/views"));

//Create an instance of ProductController
const productController = new ProductController();
server.get("/", productController.getProducts);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
