import express from "express";
import ProductsController from "./src/controllers/product.controller.js";
import UserController from "./src/controllers/user.controller.js";
import ejsLayouts from "express-ejs-layouts";
import path from "path";
import validateRequest from "./src/middlewares/validation.middleware.js";
import { uploadFile } from "./src/middlewares/file-upload.middleware.js";
import session from "express-session";
import { auth } from "./src/middlewares/auth.middleware.js";

const app = express();
const PORT = 3100;

app.use(express.static("public"));
app.use(
  session({
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(ejsLayouts);
app.use(express.urlencoded({ extended: true }));

//Setup view engine settings
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src", "views"));

//Serves the static files from the views directory to the browser
app.use(express.static("src/views"));

//Create an instance of ProductController & UserController
const productsController = new ProductsController();
const userController = new UserController();

app.get("/register", userController.getRegister);
app.post("/register", userController.postRegister);
app.get("/login", userController.getLogin);
app.post("/login", userController.postLogin);
app.get("/logout", userController.logout);

app.get("/", auth, productsController.getProducts);
app.get("/new-product", auth, productsController.getAddProduct);
app.post(
  "/",
  auth,
  uploadFile.single("imageUrl"),
  validateRequest,
  productsController.postAddProduct
);
app.get("/update-product/:id", auth, productsController.getUpdateProductView);
app.post("/update-product", auth, productsController.postUpdateProduct);
app.post("/delete-product/:id", auth, productsController.deleteProduct);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
