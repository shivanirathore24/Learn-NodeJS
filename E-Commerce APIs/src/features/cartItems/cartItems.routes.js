// Manage routes/paths to CartItemsController

// 1. Import express
import express, { Router } from "express";
import { CartItemsController } from "./cartItems.controller.js";

// 2. Initialize Express router
const cartRouter = express.Router();
const cartItemsController = new CartItemsController();

// 3. Routes related to the controller methods.
cartRouter.post("/", (req, res, next) => {
  cartItemsController.add(req, res, next);
});
cartRouter.get("/", (req, res, next) => {
  cartItemsController.get(req, res, next);
});
cartRouter.delete("/:id", (req, res, next) => {
  cartItemsController.delete(req, res, next);
});

export default cartRouter;
