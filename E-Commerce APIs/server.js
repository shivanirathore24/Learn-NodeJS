// 1. Import required modules
import express from "express";
import bodyParser from "body-parser";
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
//import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import authorizer from "./src/middlewares/basicAuth2.middleware.js";

// 2. Initialize Express server
const server = express();
server.use(bodyParser.json());

// 3. Route handling
//server.use("/api/products", basicAuthorizer, productRouter); // Product-related routes
server.use("/api/products", authorizer, productRouter);
server.use("/api/users", userRouter); // User-related routes

// 4. Default route
server.get("/", (req, res) => {
  res.send("Welcome to E-commerce API");
});

// 5. Start server
const PORT = 3100;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
