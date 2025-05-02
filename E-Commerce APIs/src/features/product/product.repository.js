import { ObjectId } from "mongodb";
import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(productData) {
    try {
      //console.log(productData);

      // 1. Add the product.
      const newProduct = new ProductModel(productData);
      console.log(newProduct); // Log the Mongoose Model instance
      const savedProduct = await newProduct.save();

      // 2. Update Categories.
      await CategoryModel.updateMany(
        {
          _id: { $in: productData.categories },
        },
        {
          $push: { products: new ObjectId(savedProduct._id) },
        }
      );
      return savedProduct;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find().toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async filter(minPrice, maxPrice, category) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }
      if (category) {
        // Replace single quotes with double quotes and parse the JSON string safely
        const parsedCategories = JSON.parse(category.replace(/'/g, '"'));
        filterExpression = {
          $and: [{ category: { $in: parsedCategories } }, filterExpression],
        };
        // filterExpression = { $and: [{ category: category }, filterExpression] };
        // filterExpression.category = category;
      }
      return collection
        .find(filterExpression)
        .project({ name: 1, price: 1, _id: 0, ratings: { $slice: -1 } })
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async rate(userID, productID, rating) {
    try {
      // 1. Check if product exists
      const productToUpdate = await ProductModel.findById(productID);
      if (!productToUpdate) {
        throw new Error("Product not found !");
      }

      // 2. Get the existing review
      let review;
      const existingReview = await ReviewModel.findOne({
        product: new ObjectId(productID),
        user: new ObjectId(userID),
      });

      if (existingReview) {
        existingReview.rating = rating;
        await existingReview.save();
        review = existingReview;
      } else {
        const newReview = new ReviewModel({
          product: new ObjectId(productID),
          user: new ObjectId(userID),
          rating: rating,
        });
        await newReview.save();
        review = newReview;
      }

      // Update the product's reviews array
      await ProductModel.findByIdAndUpdate(productID, {
        $addToSet: { reviews: review._id }, // $addToSet prevents duplicates
      });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      return await db
        .collection(this.collection)
        .aggregate([
          {
            // Get Average price per category
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }
}

export default ProductRepository;
