import ProductModel from "../models/product.model.js";

class ProductsController {
  getProducts(req, res, next) {
    let products = ProductModel.getAll();
    res.render("index", { products: products });
  }

  getAddProduct(req, res, next) {
    return res.render("new-product");
  }

  postAddProduct(req, res, next) {
    //access data from form
    console.log(req.body);
    ProductModel.add(req.body);
    let products = ProductModel.getAll();
     return res.render("index", { products });
  }
}

export default ProductsController;
