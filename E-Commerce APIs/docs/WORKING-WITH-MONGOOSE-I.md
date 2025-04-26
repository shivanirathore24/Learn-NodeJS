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
