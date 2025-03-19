import ProductModel from "./product.model.js";

export default class ProductController {
  getAllProducts(req, res) {
    const products = ProductModel.getAll();
    res.status(200).send(products);
  }

  addProduct(req, res) {
    const { name, desc, price, imageUrl, category, sizes } = req.body;
    const newProduct = {
      name,
      desc: desc || "No description available",
      price: parseFloat(price),
      imageUrl: req.file ? req.file.filename : imageUrl,
      category: category || "Uncategorized",
      sizes: Array.isArray(sizes)
        ? sizes
        : typeof sizes === "string"
        ? sizes.split(",")
        : [],
    };
    const createdRecord = ProductModel.add(newProduct);
    res.status(201).send(createdRecord);
  }


  rateProduct(req, res, next) {
    try {
      console.log(req.query);
      const userID = req.query.userID;
      const productID = req.query.productID;
      const rating = req.query.rating;
      //Intentional error: Accessing 'req.querys' (undefined) will trigger the error handler middleware.
      //const rating = req.querys.rating;
      ProductModel.rateProduct(userID, productID, rating);
      return res.status(200).send("Rating has been added !");
    } catch (err) {
      console.log("Passing error to middleware")
      next(err);
    }
  } 

  getOneProduct(req, res) {
    //const id = req.params.id;
    const { id } = req.params;
    const product = ProductModel.get(id);
    if (!product) {
      res.status(404).send("Product not found !");
    } else {
      res.status(200).send(product);
    }
  }

  filterProducts(req, res) {
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const category = req.query.category;
    const result = ProductModel.filter(minPrice, maxPrice, category);
    res.status(200).send(result);
  }
}
