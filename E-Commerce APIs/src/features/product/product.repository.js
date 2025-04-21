import { ObjectId } from "mongodb";
import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(newProduct) {
    try {
      const db = getDB(); // 1. Get the DB
      const collection = db.collection(this.collection); // 2. Get the collection
      await collection.insertOne(newProduct); // 3. Find the document
      return newProduct;
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
      return collection.find(filterExpression).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  /*
    async rate(userID, productID, rating) {
      try {
        const db = getDB();
        const collection = db.collection(this.collection);
        // 1. Find the product
        const product = await collection.findOne({
          _id: new ObjectId(productID),
        });
        // 2. Find the rating
        const userRating = product?.ratings?.find((r) => r.userID == userID);
        if (userRating) {
          // 3. Update the rating
          await collection.updateOne(
            {
              _id: new ObjectId(productID),
              "ratings.userID": new ObjectId(userID),
            },
            {
              $set: {
                "ratings.$.rating": rating,
              },
            }
          );
        } else {
          await collection.updateOne(
            {
              _id: new ObjectId(productID),
            },
            {
              $push: { ratings: { userID: new ObjectId(userID), rating } },
            }
          );
        }
      } catch (err) {
        console.log(err);
        throw new ApplicationError("Something went wrong with Data", 500);
      }
    }
  }
  */

  async rate(userID, productID, rating) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      // 1. Removes existing entry
      await collection.updateOne(
        {
          _id: new ObjectId(productID),
        },
        {
          $pull: { ratings: { userID: new ObjectId(userID) } },
        }
      );
      // 2. Add new entry
      await collection.updateOne(
        {
          _id: new ObjectId(productID),
        },
        {
          $push: { ratings: { userID: new ObjectId(userID), rating } },
        }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }
}

export default ProductRepository;
