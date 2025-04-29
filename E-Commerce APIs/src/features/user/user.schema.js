import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [25, "Name must not exceed 25 characters."],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email address is required."],
    match: [/.+\@.+\..+/, "Please provide a valid email address."],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    // validate: {
    //   validator: function (value) {
    //     return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value);
    //   },
    //   message: "Password must be between 8 and 12 characters long.",
    // },
  },
  type: {
    type: String,
    enum: {
      values: ["Customer", "Seller"],
      message: "User type must be either 'Customer' or 'Seller'.",
    },
  },
});
