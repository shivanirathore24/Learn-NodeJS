import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async addProduct(req, res) {
    try {
      const { name, desc, price, imageUrl, categories, sizes, stock } =
        req.body;
      // Convert 'categories' to array if string, else keep it as array
      const categoriesArray =
        typeof categories === "string"
          ? categories.split(",").map((c) => c.trim())
          : Array.isArray(categories)
          ? categories.map((c) => c.trim())
          : [];

      // Convert 'sizes' to array if string, else keep it as array
      const sizesArray = Array.isArray(sizes)
        ? sizes
        : typeof sizes === "string"
        ? sizes.split(",")
        : [];

      const newProduct = new ProductModel(
        name,
        desc || "No description available",
        parseFloat(price),
        req.file ? req.file.filename : imageUrl,
        categoriesArray,
        sizesArray,
        stock
      );
      //console.log(newProduct);
      const createdProduct = await this.productRepository.add(newProduct);
      res.status(201).send(createdProduct);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async addProductStock(req, res) {
    try {
      const productId = req.params.id;
      const { quantity } = req.body;

      if (quantity === undefined || typeof quantity !== "number") {
        return res
          .status(400)
          .send(
            "Please provide a valid 'quantity' to add to stock in the request body."
          );
      }

      const updatedProduct = await this.productRepository.addStock(
        productId,
        quantity
      );

      if (!updatedProduct) {
        return res.status(404).send("Product not found.");
      }

      res.status(200).send(updatedProduct);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Something went wrong while adding stock.");
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
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
      return res.status(500).send("Something went wrong");
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

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const categories = req.query.categories;
      const result = await this.productRepository.filter(
        minPrice,
        maxPrice,
        categories
      );
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async averagePrice(req, res, next) {
    try {
      const result =
        await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }
}
