import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  desc: String,
  price: Number,
  imageUrl: String,
  category: String,
  sizes: [String],
  stock: Number,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
