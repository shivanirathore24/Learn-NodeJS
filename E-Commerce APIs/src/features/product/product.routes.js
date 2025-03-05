// Manage routes/paths to ProductController

// 1. Import express
import express, { Router } from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";

// 2. Initialize Express router
const productRouter = express.Router();
const productController = new ProductController();

// All the paths to the controller methods.

/* Define specific routes first */
//localhost:3000/api/products/filter?minPrice=10&maxPrice=20&category=Category1
productRouter.get("/filter", productController.filterProducts);
productRouter.get("/", productController.getAllProducts);
productRouter.post(
  "/",
  upload.single("imageUrl"),
  productController.addProduct
);
productRouter.post("/rate", productController.rateProduct);

/* Define dynamic route last */
productRouter.get("/:id", productController.getOneProduct);

export default productRouter;
