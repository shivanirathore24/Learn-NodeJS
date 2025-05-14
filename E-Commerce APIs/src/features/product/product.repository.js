import mongoose from "mongoose";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {
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
          $push: { products: savedProduct._id },
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
      return await ProductModel.find();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async get(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null; // Or throw an error if you prefer
      }
      return await ProductModel.findById(id);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async filter(minPrice, maxPrice, categories) {
    try {
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
      if (categories) {
        // Replace single quotes with double quotes and parse the JSON string safely
        const parsedCategories = JSON.parse(categories.replace(/'/g, '"'));
        filterExpression.categories = { $in: parsedCategories };
      }

      return await ProductModel.find(filterExpression).select({
        name: 1,
        price: 1,
        ratings: { $slice: -1 },
      });
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
        product: productID,
        user: userID,
      });

      if (existingReview) {
        existingReview.rating = rating;
        await existingReview.save();
        review = existingReview;
      } else {
        const newReview = new ReviewModel({
          product: productID,
          user: userID,
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
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async addStock(productId, quantityToAdd) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        { $inc: { stock: quantityToAdd } },
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      console.error("Error adding stock:", error);
      throw new ApplicationError("Failed to add stock to product.", 500);
    }
  }

  async averageProductPricePerCategory() {
    try {
      return await ProductModel.aggregate([
        {
          $unwind: "$categories",
        },
        {
          $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $unwind: "$categoryInfo",
        },
        {
          $group: {
            _id: "$categoryInfo.name",
            averagePrice: { $avg: "$price" },
          },
        },
        {
          $project: {
            _id: 1,
            averagePrice: { $round: ["$averagePrice", 2] },
          },
        },
      ]);
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }
}

export default ProductRepository;
