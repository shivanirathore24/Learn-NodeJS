import ProductModel from "./product.model.js";

export default class ProductController {
  getAllProducts(req, res) {
    // Code for getting all products
    const products = ProductModel.GetAll();
    res.status(200).send(products);
  }

  addProduct(req, res) {
    // Code for adding a product
  }

  rateProduct(req, res) {
    // Code for rating a product
  }

  getOneProduct(req, res) {
    // Code for getting one product
  }
}
