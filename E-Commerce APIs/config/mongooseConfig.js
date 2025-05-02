import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../src/features/product/category.schema.js";
dotenv.config();

const url = process.env.DB_URL;
export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected using Mongoose !");
    addCategories();
  } catch (err) {
    console.log("Error while connecting to db !");
    console.log(err);
  }
};

async function addCategories() {
  const CategoryModel = mongoose.model("Category", categorySchema);
  const categories = await CategoryModel.find();
  if (!categories || categories.length == 0) {
    await CategoryModel.insertMany([
      { name: "Geography" },
      { name: "Global Politics" },
      { name: "Map" },
      { name: "Non-Fiction" },
      { name: "Science" },
      { name: "Physics" },
      { name: "Genetics" },
      { name: "Computers" },
      { name: "Software Development" },
      { name: "Programming" },
      { name: "Articial Intelligence" },
      { name: "Technology" },
    ]);
  }
  console.log("Categories are added !");
}
