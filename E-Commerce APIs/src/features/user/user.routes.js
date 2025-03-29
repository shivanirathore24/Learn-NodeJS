// Import necessary modules
import express from "express";
import UserController from "./user.controller.js";

// Initialize router and user controller
const userRouter = express.Router();
const userController = new UserController();

// Define authentication routes
userRouter.post("/signup", (req, res) => {
  userController.signUp(req, res);
}); // User registration
userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res); 
}); // User login
export default userRouter;
