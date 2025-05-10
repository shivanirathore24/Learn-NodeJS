import mongoose from "mongoose";

// 1. Define the Mongoose Schema
export const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      // Add this for storing item details in the order
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        // Add price here, important for order history
        type: Number,
        required: true,
      },
    },
  ],
});
