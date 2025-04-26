## WORKING WITH MONGOOSE-I

## Understanding Mongoose

Mongoose is a tool that helps you structure and manage MongoDB data easily in Node.js. It provides a schema-based solution to model your application data.

### 🔹 Key Advantages of Mongoose:

1. Schema Validation – Defines structure and data types for documents.
2. Middleware Support – Hooks like pre and post for operations.
3. Built-in Data Casting – Automatically converts data to correct types.
4. Query Helpers – Easy chaining and reusable query logic.
5. Population – Simplifies joining documents (similar to SQL joins).
6. Cleaner Code – Makes MongoDB operations more organized and readable.

## Connecting using Mongoose

### Created 'mongooseConfig.js' file

```javascript
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.DB_URL;
export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected using Mongoose !");
  } catch (err) {
    console.log("Error while connecting to db !");
    console.log(err);
  }
};
```

#### What Your Code Does:

1. Import libraries
   - `mongoose` → helps you connect to MongoDB easily.
   - `dotenv` → loads environment variables (like DB_URL) from a .env file into your project.
2. Load environment variables
   - `dotenv.config();` → reads .env file so you can use process.env.DB_URL.
3. Get the MongoDB URL
   - `const url = process.env.DB_URL;` → grabs the database connection URL safely.
4. Create an async function to connect
   - `connectUsingMongoose` is an `async` function because connecting to a database takes time (it's an I/O operation).
   - Inside try-catch:
     - `await mongoose.connect(url);` → tries to connect to the MongoDB database using Mongoose.
     - If successful, it prints: "MongoDB connected using Mongoose".
     - If any error happens, it catches it and prints: "Error while connecting to db" and the error details.
5. Export the function
   - `export const connectUsingMongoose = async () => {...}` → allows you to import and call this function from another file (like server.js).

<img src="./images/connectingUsingMongoose.png" alt="Add CartItem Postman" width="650" height="auto">

## Creating Schema

### What is a Schema in Mongoose ?

Schema is like a blueprint 🏗️ that defines the structure and rules for documents inside a MongoDB collection.
It tells Mongoose what kind of data your documents should have.

#### 📚 Example:

Imagine you are creating a "Orders" collection for an online shopping app.
Each order should have:

- a customer name (text)
- a product ID (text)
- a quantity (number)
- an order date (date)
- a status (text) like "pending", "shipped", "delivered"

👉 You define a Schema in Mongoose to make sure every order has all these fields correctly filled.

### ✨ Why Schema is Important ?

1. Gives structure to MongoDB data ->
   MongoDB is naturally flexible (schema-less), but Schema adds clear rules about how your data should look.

2. Performs automatic data validation -> It checks if the incoming data matches the correct types and rules before saving it to the database.

3. Adds powerful features like methods, virtual fields, and hooks ->
   You can add custom functions (methods), temporary fields (virtuals), and pre/post actions (hooks) like encrypting passwords before saving.

### 1. Creating Users Schema (user.schema.js)

```javascript
import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  type: { type: String, enum: ["Customer", "Seller"] },
});
```

This code imports the mongoose library, which allows you to interact with MongoDB using structured models.
Then, it defines and exports a userSchema, which acts like a blueprint for a User document in your database.

The userSchema specifies four fields:

- `name`, which must be a simple text (String),
- `email`, which must be a String and must be unique (no two users can have the same email),
- `password`, which is a String meant to store the user's password (usually hashed before saving),
- `type`, which is a String but restricted to only two values: `"Customer"` or `"Seller"`, using the `enum` property to enforce this rule.

This schema ensures every user document follows a consistent structure, validates data automatically, and prevents errors like duplicate emails or invalid user types.

#### ✨ In very simple words:

"This Schema sets clear rules: Every User must have a name, a unique email, a password, and a role that must be either Customer or Seller ~ nothing extra, nothing missing."

### 2. Products Schema (product.schema.js)

```javascript
import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  categpry: String,
  description: String,
  inStock: Number,
});
```

This code imports the mongoose library, which allows you to work with MongoDB using structured models. Then, it defines and exports a productSchema, which acts as a blueprint for a Product document in your database.

The productSchema specifies five fields:

- `name`, which must be a simple text (String) representing the product's name.
- `description`, which is a String giving a brief description of the product.
- `price`, which must be a Number representing the product's price.
- `category`, which is a String specifying the product's category (e.g., "Electronics").
- `inStock`, which is a Number indicating how many units of the product are available.

This schema ensures that every product document follows a consistent structure, validates the data automatically, and prevents errors like missing information or incorrect product details.

#### ✨ In very simple words:

"This Schema sets clear rules: Every Product must have a name, a price, a category, a description, and a stock count ~ nothing extra, nothing missing."

### 3. Created CartItems Schema (cartItems.schema.js)

```javascript
import mongoose from "mongoose";

export const cartSchema = new Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quantity: Number,
});
```

This code defines a cartSchema for storing cart-related information in MongoDB using Mongoose. Here's the breakdown:

The cartSchema specifies three fields:

- `productID`:

  - Type: `mongoose.Schema.Types.ObjectId`
  - Reference: It references the `Product` collection. This means each cart item is linked to a specific product in the `Product` collection. The `ObjectId` is a unique identifier for each product.

- `userID`:

  - Type: `mongoose.Schema.Types.ObjectId`
  - Reference: It references the `User` collection. Each cart is associated with a specific user, identified by their unique `ObjectId` from the `User` collection.

- `quantity`:
  - Type: `Number`
  - This field stores how many units of the product the user has.

This schema ensures every cart document is connected to a product and a user, while also storing how many units of that product the user has.

#### ✨ In simple words:

"This schema defines the cart rules: Each cart contains a product (linked by its ID), belongs to a user (linked by their ID), and includes a quantity for that product ~ nothing extra, nothing missing."
