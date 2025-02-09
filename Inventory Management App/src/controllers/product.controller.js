import path from "path";

export default class ProductController {
  getProducts(req, res) {
    console.log(path.resolve());
    return res.sendFile(path.join(path.resolve(), "src", "views", "products.html"));
  }
}
