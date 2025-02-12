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
    // validate data
    const { name, price, imageUrl } = req.body;
    let errors = [];
    if (!name || name.trim() == "") {
      errors.push("Name is required");
    }
    if (!price || parseFloat(price) < 1) {
      errors.push("Price must be a positive value");
    }
    try {
      const validUrl = new URL(imageUrl);
    } catch (err) {
      errors.push("URL is invalid");
    }

    if (errors.length > 0) {
      return res.render("new-product", {
        errorMessage: errors[0],
      });
    }
    // if (errors.length != 0) {
    //   res.render("new-product", { errorMessage: errors[0] });
    // } else {
    //   res.render("products", { products: products });
    // }

    ProductModel.add(req.body);
    var products = ProductModel.getAll();
    res.render("index", { products });
  }
}

export default ProductsController;
