// Import necessary modules  
import express from "express";  
import UserController from "./user.controller.js";  

// Initialize router and user controller  
const userRouter = express.Router();  
const userController = new UserController();  

// Define authentication routes  
userRouter.post("/signup", userController.signUp); // User registration  
userRouter.post("/signin", userController.signIn); // User login  

export default userRouter;  

