import mongoose from "mongoose";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { cartItemSchema } from "./cartItems.schema.js";

// Define the Mongoose model
const CartItemModel = mongoose.model("CartItem", cartItemSchema);

export default class CartItemsRepository {
  async add(productID, userID, quantity) {
    try {
      // Check if the product already exists in the user's cart
      const existingItem = await CartItemModel.findOne({
        productID: productID,
        userID: userID,
      });

      if (existingItem) {
        // If it exists, just update the quantity
        await CartItemModel.updateOne(
          { _id: existingItem._id },
          { $inc: { quantity: quantity } }
        );
      } else {
        // If not exists, insert the new item
        const newItem = new CartItemModel({
          productID: productID,
          userID: userID,
          quantity: quantity,
        });
        await newItem.save();
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async get(userID) {
    try {
      return await CartItemModel.find({ userID: userID })
        .populate("productID")
        .populate("userID");
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async delete(cartItemID, userID) {
    try {
      const result = await CartItemModel.deleteOne({
        _id: cartItemID,
        userID: userID,
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }
}
