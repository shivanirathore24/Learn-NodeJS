import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async addProduct(req, res) {
    try {
      const { name, desc, price, imageUrl, category, sizes } = req.body;
      const newProduct = new ProductModel(
        name,
        desc || "No description available",
        parseFloat(price),
        req.file ? req.file.filename : imageUrl,
        category || "Uncategorized",
        Array.isArray(sizes)
          ? sizes
          : typeof sizes === "string"
          ? sizes.split(",")
          : []
      );
      const createdProduct = await this.productRepository.add(newProduct);
      res.status(201).send(createdProduct);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async rateProduct(req, res, next) {
    try {
      console.log(req.query);
      const userID = req.userID;
      const productID = req.body.productID;
      const rating = req.body.rating;
      //Intentional error: Accessing 'req.querys' (undefined) will trigger the error handler middleware.
      //const rating = req.querys.rating;
      await this.productRepository.rate(userID, productID, rating);
      return res.status(200).send("Rating has been added !");
    } catch (err) {
      console.log(err);
      console.log("Passing error to middleware");
      next(err);
    }
  }

  async getOneProduct(req, res) {
    try {
      //const id = req.params.id;
      const { id } = req.params;
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send("Product not found !");
      } else {
        res.status(200).send(product);
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      const result = await this.productRepository.filter(
        minPrice,
        maxPrice,
        category
      );
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
