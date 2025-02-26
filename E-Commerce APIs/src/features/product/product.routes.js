// Manage routes/paths to ProductController

// 1. Import express
import express, { Router } from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";

// 2. Initialize Express router
const productRouter = express.Router();
const productController = new ProductController();

// All the paths to the controller methods.
// localhost:3000/api/products
productRouter.get("/", productController.getAllProducts);
productRouter.post(
  "/",
  upload.single("imageUrl"),
  productController.addProduct
);

export default productRouter;
