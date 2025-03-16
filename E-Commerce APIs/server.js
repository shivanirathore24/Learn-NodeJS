// 1. Import required modules
import express from "express";
import swagger from "swagger-ui-express";
import cors from 'cors';
import bodyParser from "body-parser";
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import jwtAuth from "./src/middlewares/jwtAuth.middleware.js";
import cartRouter from "./src/features/cartItems/cartItems.routes.js";
import apiDocs from "./swagger.json" with { type: "json" };
import winstonLoggerMiddleware from "./src/middlewares/winstonLogger.middleware.js";

// 2. Initialize Express server
const server = express();
server.use(bodyParser.json()); // Parse JSON request bodies

// 3. CORS policy configuration
var corsOptions = {
  origin: 'http://localhost:5501',
}
server.use(cors(corsOptions));
/*
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", 'http://localhost:5501'); // Allow specific origin
  res.header("Access-Control-Allow-Headers", "*"); // Allow all headers
  res.header("Access-Control-Allow-Methods", "*"); // Allow all methods

  if (req.method === 'OPTIONS') return res.sendStatus(200); // Handle preflight requests
  next(); // Continue to next middleware
});
*/

// 4. Route handling
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs)); // Serve API documentation
server.use (winstonLoggerMiddleware);
server.use("/api/products", jwtAuth, productRouter); // Protected product routes
server.use("/api/users", userRouter); // Public user routes
server.use("/api/cartItems", jwtAuth, cartRouter); // Protected cart routes

// 5. Default route
server.get("/", (req, res) => {
  res.send("Welcome to E-commerce API"); // Basic welcome message
});

// 6. Middleware to handle 404 requests
const API_DOCS = "http://localhost:3100/api-docs/";
server.use((req, res) => {
  res.status(400).send(`API not found. Check <a href="${API_DOCS}">API Documentation</a>`); // Send 404 response
});

// 7. Start server
const PORT = 3100;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`); // Log server start
});
