import mongoose from "mongoose";

import { ApplicationError } from "../../error-handler/applicationError.js";
import { orderSchema } from "./order.schema.js";
import { productSchema } from "../product/product.schema.js";
import { cartItemSchema } from "../cartItems/cartItems.schema.js";

// Model definitions
const OrderModel = mongoose.model("Order", orderSchema);
const CartItemModel = mongoose.model("CartItem", cartItemSchema);
const ProductModel = mongoose.model("Product", productSchema);

export default class OrderRepository {
  async placeOrder(userID) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Fetch cart items and populate product details
      const cartItems = await CartItemModel.find({ userID })
        .populate("productID")
        .session(session); // Optional: session-aware read

      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      let finalTotalAmount = 0;
      const orderItems = [];

      for (const cartItem of cartItems) {
        const product = cartItem.productID;
        const quantity = cartItem.quantity;

        if (!product || product.stock < quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        finalTotalAmount += product.price * quantity;

        orderItems.push({
          productID: product._id,
          quantity,
          price: product.price,
        });
      }

      // 2. Create a new order document
      const newOrder = new OrderModel({
        userID,
        totalAmount: finalTotalAmount,
        items: orderItems,
        timestamp: new Date(),
      });

      await newOrder.save({ session });

      // 3. Update stock for each product
      for (const cartItem of cartItems) {
        await ProductModel.updateOne(
          { _id: cartItem.productID._id },
          { $inc: { stock: -cartItem.quantity } },
          { session }
        );
      }

      // 4. Clear user's cart
      await CartItemModel.deleteMany({ userID }, { session });

      // Commit transaction
      await session.commitTransaction();
    } catch (error) {
      // Rollback transaction on failure
      await session.abortTransaction();
      console.error("Error placing order:", error);
      throw new ApplicationError("Order Failed!", 500);
    } finally {
      session.endSession();
    }
  }
}
