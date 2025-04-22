// 1. Import express
import express, { Router } from "express";
import OrderController from "./order.controller.js";

// 2. Initialize Express router
const orderRouter = express.Router();
const orderController = new OrderController();

// 3. Paths to the orderController methods.
orderRouter.post("/", (req, res, next) => {
  orderController.placeOrder(req, res, next);
});

export default orderRouter;
