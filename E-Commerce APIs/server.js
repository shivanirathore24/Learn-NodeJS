// 1. Import required modules
import express from "express";
import swagger from "swagger-ui-express";
import bodyParser from "body-parser";
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import jwtAuth from "./src/middlewares/jwtAuth.middleware.js";
import cartRouter from "./src/features/cartItems/cartItems.routes.js";
import apiDocs from "./swagger.json" with { type: "json" };


// 2. Initialize Express server
const server = express();
server.use(bodyParser.json());

// 3. Route handling
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use("/api/products", jwtAuth, productRouter); // Product-related routes
server.use("/api/users", userRouter); // User-related routes
server.use("/api/cartItems", jwtAuth, cartRouter); // CartItems-related routes

// 4. Default route
server.get("/", (req, res) => {
  res.send("Welcome to E-commerce API");
});

// 5.Middleware to handle 404 requests.
const API_DOCS = "http://localhost:3100/api-docs/";
server.use((req, res) => {
  res.status(400).send(`API not found. Please check documentation for more information at <a href="${API_DOCS}">API Documentation</a>`);
});

// 6. Start server
const PORT = 3100;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
