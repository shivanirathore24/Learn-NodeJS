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
productRouter.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});
productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
productRouter.post("/", upload.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});
productRouter.post("/rate", (req, res, next) => {
  productController.rateProduct(req, res, next);
});

productRouter.get("/averagePrice", (req, res, next) => {
  productController.averagePrice(req, res);
});

/* Define dynamic route last */
productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});

export default productRouter;
