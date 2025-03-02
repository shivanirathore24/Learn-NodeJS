// Import required modules
import bAuth from "express-basic-auth"; // Basic Auth middleware
import { UserModel } from "../features/user/user.model.js"; // User model

// Custom function for basic authentication
const basicAuthorizer = (username, password) => {
  const users = UserModel.getAll(); // Get all users
  const user = users.find((u) => bAuth.safeCompare(username, u.email)); // Find user by email
  return user && bAuth.safeCompare(password, user.password); // Validate password
};

// Configure and export the middleware
const authorizer = bAuth({
  authorizer: basicAuthorizer, // Use custom authorizer
  challenge: true, // Enable auth prompt
});

export default authorizer;
