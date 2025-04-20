import { ObjectId } from "mongodb";
import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartItemsRepository {
  constructor() {
    this.collection = "cartItems";
  }

  async add(productID, userID, quantity) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      // Check if the product already exists in the user's cart
      const existingItem = await collection.findOne({
        productID: new ObjectId(productID),
        userID: new ObjectId(userID),
      });

      if (existingItem) {
        // If it exists, just update the quantity
        await collection.updateOne(
          { _id: existingItem._id },
          { $inc: { quantity: quantity } }
        );
      } else {
        // If not exists, get the next counter and insert the new item
        const id = await this.getNextCounter(db);
        console.log("Generated ID for new item:", id);

        await collection.insertOne({
          _id: id,
          productID: new ObjectId(productID),
          userID: new ObjectId(userID),
          quantity: quantity,
        });
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async get(userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find({ userID: new ObjectId(userID) }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async delete(cartItemID, userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        _id: new ObjectId(cartItemID),
        userID: new ObjectId(userID),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async getNextCounter(db) {
    const resultDocument = await db
      .collection("counters")
      .findOneAndUpdate(
        { _id: "cartItemId" },
        { $inc: { value: 1 } },
        { returnDocument: "after" }
      );
    console.log("Next counter value:", resultDocument.value);
    return resultDocument.value;
  }
}
