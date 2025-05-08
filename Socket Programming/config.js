import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/chatApp");
    console.log("DB is connected!");
  } catch (err) {
    console.error("DB connection error:", err.message);
  }
};
