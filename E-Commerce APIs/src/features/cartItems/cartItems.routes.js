// Manage routes/paths to CartItemsController

// 1. Import express
import express, { Router } from "express";
import { CartItemsController } from "./cartItems.controller.js";

// 2. Initialize Express router
const cartRouter = express.Router();
const cartItemsController = new CartItemsController();

// 3. Routes related to the controller methods.
cartRouter.post("/", cartItemsController.add);

export default cartRouter;
