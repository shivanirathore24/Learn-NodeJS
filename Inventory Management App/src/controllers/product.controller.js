import ProductModel from "../models/product.model.js";

class ProductsController {
  getProducts(req, res, next) {
    var products = ProductModel.getAll();
    res.render("index", { products });
  }

  getAddProduct(req, res, next) {
    res.render("new-product", {
      errorMessage: null,
    });
  }

  postAddProduct(req, res, next) {
    ProductModel.add(req.body);
    var products = ProductModel.getAll();
    res.render("index", { products });
  }
}

export default ProductsController;
