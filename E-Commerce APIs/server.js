// 1. Import required modules
import express from "express";
import bodyParser from "body-parser";
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import jwtAuth from "./src/middlewares/jwtAuth.middleware.js";
import cartRouter from "./src/features/cartItems/cartItems.routes.js";

// 2. Initialize Express server
const server = express();
server.use(bodyParser.json());

// 3. Route handling
server.use("/api/products", jwtAuth, productRouter); // Product-related routes
server.use("/api/users", userRouter); // User-related routes
server.use("/api/cartItems", jwtAuth, cartRouter); // CartItems-related routes

// 4. Default route
server.get("/", (req, res) => {
  res.send("Welcome to E-commerce API");
});

// 5. Start server
const PORT = 3100;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
