// Import necessary modules
import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";

// Initialize router and user controller
const userRouter = express.Router();
const userController = new UserController();

// Define authentication routes
userRouter.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next);
}); // User registration
userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res); // User login
});

userRouter.put("/resetPassword", jwtAuth, (req, res, next) => {
  userController.resetPassword(req, res, next);
});
export default userRouter;
