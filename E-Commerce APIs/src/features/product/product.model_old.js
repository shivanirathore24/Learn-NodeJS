import { ApplicationError } from "../../error-handler/applicationError.js";
import { UserModel } from "../user/user.model.js";

export default class ProductModel {
  constructor(name, desc, price, imageUrl, category, sizes, id) {
    this._id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageUrl = imageUrl;
    this.category = category;
    this.sizes = sizes;
  }

  static add(product) {
    product = { id: products.length + 1, ...product }; // Reassign product with id first
    products.push(product);
    return product;
  }

  // static add(product) {
  //   product.id = products.length + 1;
  //   products.push(product);
  //   return product;
  // }

  static getAll() {
    return products;
  }

  static get(id) {
    const product = products.find((i) => i.id == id);
    return product;
  }

  static filter(minPrice, maxPrice, category) {
    const result = products.filter((product) => {
      return (
        (!minPrice || product.price >= minPrice) &&
        (!maxPrice || product.price <= maxPrice) &&
        (!category || product.category == category)
      );
    });
    return result;
  }

  static rateProduct(userID, productID, rating) {
    // 1. Validate User
    const user = UserModel.getAll().find((u) => u.id == userID);
    if (!user) {
      throw new ApplicationError("User not found", 404); //User-defined Error
    }
    // 1. Validate Product
    const product = products.find((p) => p.id == productID);
    if (!product) {
      throw new ApplicationError("Product not found", 400);
    }

    // 3. Validate Rating Input
    if (!rating || isNaN(rating)) {
      throw new ApplicationError("Please provide a valid rating", 400);
    }

    // 4. Check if there are ratings and if not then add rating array.
    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({
        userID: userID,
        rating: rating,
      });
    } else {
      // 5. Check if user rating is already exists
      const existingRatingIndex = product.ratings.findIndex(
        (r) => r.userID == userID
      );

      if (existingRatingIndex >= 0) {
        // 6. Update the existing rating
        product.ratings[existingRatingIndex] = {
          userID: userID,
          rating: rating,
        };
      } else {
        // 7. Add new rating if not already rated
        product.ratings.push({
          userID: userID,
          rating: rating,
        });
      }
    }
  }
}

var products = [
  new ProductModel(
    1,
    "Product 1",
    "Description for Product 1",
    19.99,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",
    "Category1"
  ),
  new ProductModel(
    2,
    "Product 2",
    "Description for Product 2",
    29.99,
    "https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",
    "Category2",
    ["M", "XL"]
  ),
  new ProductModel(
    3,
    "Product 3",
    "Description for Product 3",
    39.99,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    "Category3",
    ["M", "XL", "S"]
  ),
];

/*
//ADD PRODUCTS DATA
{
    "name": "Prisoners of Geography",
    "desc": "How geography shapes global politics by Tim Marshall.",
    "price": 492,
    "imageUrl": "https://m.media-amazon.com/images/I/81xjhH+H57L._SL1500_.jpg",
    "category": "Geography",
    "sizes": ["Paperback", "Hardcover", "Kindle"] 
},
{
    "name": "Astrophysics for People in a Hurry",
    "desc": "A quick dive into space and time by Neil deGrasse Tyson.",
    "price": 799,
    "imageUrl": "https://m.media-amazon.com/images/I/71c46ivy5xL._SL1200_.jpg",
    "category": "Science",
    "sizes": ["Hardcover", "Kindle"]
},
{
    "name": "Clean Code",
    "desc": "A guide to writing clean and maintainable code by Robert C. Martin.",
    "price": 1999,
    "imageUrl": "https://m.media-amazon.com/images/I/41bOkXnNBjL._SY445_SX342_.jpg",
    "category": "Computers",
    "sizes": ["Paperback", "Kindle"]
},
{
    "name": "The Power of the Map",
    "desc": "Exploring how maps shape our world and perceptions by Denis Wood.",
    "price": 1615,
    "imageUrl": "https://m.media-amazon.com/images/I/51yePqOJh3L.jpg",
    "category": "Geography",
    "sizes": ["Paperback"]
},
{
    "name": "The Gene: An Intimate History",
    "desc": "A journey into genetics and its future by Siddhartha Mukherjee.",
    "price": 799.00,
    "imageUrl": "https://m.media-amazon.com/images/I/71HcXS1+R-L._SL1500_.jpg",
    "category": "Science",
    "sizes": ["Paperback", "Hardcover", "Kindle"]
},
{
    "name": "Artificial Intelligence",
    "desc": "A modern approach to AI by Stuart Russell and Peter Norvig.",
    "price": 924,
    "imageUrl": "https://m.media-amazon.com/images/I/61-6TTTBZeL._SL1000_.jpg",
    "category": "Computers",
    "sizes": ["Hardcover"]
}

*/
