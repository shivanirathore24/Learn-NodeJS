## MONGODB TO MONGOOSE MIGRATION

## User Feature - Already Done

## Product Feature - Updated

### 🔄Changes in 'product.repository.js' file

This updated **ProductRepository** uses Mongoose instead of raw MongoDB, simplifying product operations like add, get, filter, rate, and average price calculation with cleaner, schema-based methods.

### 1. getAll() Method

#### Before (MongoDB Native):

```javascript
async getAll() {
  try {
    const db = getDB();
    const collection = db.collection(this.collection);
    return await collection.find().toArray();
  } catch (err) {
    console.log(err);
    throw new ApplicationError("Something went wrong with Data", 500);
  }
}
```

- Manual DB and Collection Access: It first retrieves the database instance using `getDB()` and then accesses the specific collection (`this.collection`, which is "products") using `db.collection()`.
- Native MongoDB Query: It uses the native MongoDB driver's `find()` method to get all documents in the collection and then uses `toArray()` to convert the cursor result into an array of JavaScript objects.

#### After (Mongoose):

```javascript
async getAll() {
  try {
    return await ProductModel.find();
  } catch (err) {
    console.log(err);
    throw new ApplicationError("Something went wrong with Data", 500);
  }
}
```

- Direct Mongoose Query: It directly uses the Mongoose model `ProductModel`. The `find()` method, when called without any arguments, retrieves all documents from the MongoDB collection associated with the `ProductModel`. Mongoose handles the underlying database interaction.
- Mongoose Returns a Promise: `ProductModel.find()` returns a promise that resolves to an array of Mongoose documents. You don't need to explicitly call `.toArray()`.

### 2. get(id) Method

#### Before (MongoDB Native)

```javascript
async get(id) {
  try {
    const db = getDB();
    const collection = db.collection(this.collection);
    return await collection.findOne({ _id: new ObjectId(id) });
  } catch (err) {
    console.log(err);
    throw new ApplicationError("Something went wrong with Data", 500);
  }
}
```

- It manually gets the database and the "products" collection.
- It uses `collection.findOne()` with a manually created `ObjectId` to find the product.

#### After (Mongoose)

```javascript
async get(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null; // Or throw an error if you prefer
    }
    return await ProductModel.findById(id);
  } catch (err) {
    console.log(err);
    throw new ApplicationError("Something went wrong with Data", 500);
  }
}
```

- It directly uses the Mongoose ProductModel.
- It first validates if the provided id is a valid MongoDB ObjectId format.
- It then uses ProductModel.findById(id), which is a Mongoose method that simplifies finding a document by its \_id. Mongoose handles the ObjectId conversion.

### 3. filter(minPrice, maxPrice, categories) Method

#### Before (MongoDB Native):

```javascript
async filter(minPrice, maxPrice, category) {
  try {
    const db = getDB();
    const collection = db.collection(this.collection);
    let filterExpression = {};

    if (minPrice) {
      filterExpression.price = { $gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      filterExpression.price = {
        ...filterExpression.price,
        $lte: parseFloat(maxPrice),
      };
    }

    if (category) {
      // Replace single quotes with double quotes and parse the JSON string safely
      const parsedCategories = JSON.parse(category.replace(/'/g, '"'));
      filterExpression = {
        $and: [{ category: { $in: parsedCategories } }, filterExpression],
      };
    }

    return collection
      .find(filterExpression)
      .project({ name: 1, price: 1, _id: 0, ratings: { $slice: -1 } })
      .toArray();
  } catch (err) {
    console.log(err);
    throw new ApplicationError("Something went wrong with Data", 500);
  }
}
```

#### After (Mongoose):

```javascript
async filter(minPrice, maxPrice, categories) {
  try {
    let filterExpression = {};

    if (minPrice) {
      filterExpression.price = { $gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      filterExpression.price = {
        ...filterExpression.price,
        $lte: parseFloat(maxPrice),
      };
    }

    if (categories) {
      // Replace single quotes with double quotes and parse the JSON string safely
      const parsedCategories = JSON.parse(categories.replace(/'/g, '"'));
      filterExpression.categories = { $in: parsedCategories };
    }

    return await ProductModel.find(filterExpression).select({
      name: 1,
      price: 1,
      ratings: { $slice: -1 },
    });
  } catch (err) {
    console.log(err);
    throw new ApplicationError("Something went wrong with Data", 500);
  }
}
```

Explaination:

1. Parameter Name:
   - The third parameter is now categories instead of category. This aligns better with the fact that you are likely passing an array of category IDs for filtering.
2. MongoDB Driver vs. Mongoose:
   - Old Code: The older version used the MongoDB driver directly (getDB(), db.collection(), collection.find()).
   - New Code: This version uses the Mongoose model ProductModel.find(filterExpression). This is a key difference. Mongoose provides schema-level control, validation, and more convenient querying.
3. Filtering by Categories:
   - Old Code:
     ```javascript
     if (category) {
       const parsedCategories = JSON.parse(category.replace(/'/g, '"'));
       filterExpression = {
         $and: [{ category: { $in: parsedCategories } }, filterExpression],
       };
     }
     ```
     - This part was attempting to filter using a field named `category` (singular), which doesn't match your `productSchema` where the array of category ObjectIds is under the `categories` (plural) field. Also, it was using `$and` in a way that might not have been the intended logic if you just wanted to filter by price and/or categories.
   - New Code
     ```javascript
     if (categories) {
       const parsedCategories = JSON.parse(categories.replace(/'/g, '"'));
       filterExpression.categories = { $in: parsedCategories };
     }
     ```
     - This is the corrected way to filter by categories using Mongoose with your schema. It directly sets the categories field in the filterExpression to use the $in operator. This means that a product will be included in the results if its categories array contains at least one of the ObjectIds in the parsedCategories array.
4. Projection:
   - Old Code: Used the MongoDB driver's `project()` method with `_id: 0`.
   - New Code: Uses Mongoose's `select()` method, which achieves a similar result but is the Mongoose way of specifying which fields to include or exclude. `select({ name: 1, price: 1, _id: 0, ratings: { $slice: -1 } })` includes `name`, `price`, and the last rating from the ratings array, and explicitly excludes the `_id`.

In essence, the updated code switches from using the direct MongoDB driver to using Mongoose for querying and correctly targets the categories field in your product documents for filtering based on an array of category ObjectIds.

### 4. averageProductPricePerCategory() Method

#### Before (MongoDB Native):

```javascript
async averageProductPricePerCategory() {
  try {
    const db = getDB();
    return await db
      .collection(this.collection)
      .aggregate([
        {
          $group: {
            _id: "$category",
            averagePrice: { $avg: "$price" },
          },
        },
      ])
      .toArray();
  } catch (err) {
    console.log(err);
    throw new ApplicationError("Something went wrong with Data", 500);
  }
}
```

#### After (Mongoose):

```javascript
async averageProductPricePerCategory() {
  try {
    return await ProductModel.aggregate([
      {
        $unwind: "$categories",
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $group: {
          _id: "$categoryInfo.name",
          averagePrice: { $avg: "$price" },
        },
      },
      {
        $project: {
          _id: 1,
          averagePrice: { $round: ["$averagePrice", 2] },
        },
      },
    ]);
  } catch (err) {
    console.log(err);
    throw new ApplicationError("Something went wrong with Data", 500);
  }
}
```

The updated code, which uses Mongoose, performs a more sophisticated aggregation to calculate the average price per category name.

1. `$unwind: "$categories"`:
   - Since a product can belong to multiple categories (the `categories` field is an array of ObjectIds), this stage deconstructs the array, creating a separate document for each category a product belongs to.
2. `$lookup`:
   - This stage joins the product documents with the `categories` collection. It matches the `categories` ObjectId from the product with the `_id` of a category document.
   - The matched category information is added to the product document as a new array field called `categoryInfo`.
3. `$unwind: "$categoryInfo"`:
   - The `$lookup` results in an array (`categoryInfo`), so this stage deconstructs that array, making the category details directly accessible in the document.
4. `$group`:
   - This stage groups the processed documents by the `name` field from the `categoryInfo` (which now holds the category document). For each category name, it calculates the average of the `price` of the associated products.
5. `$project`:
   - This stage reshapes the output. It keeps the `_id` (which is now the category name) and rounds the `averagePrice` to two decimal places.

The updated version provides a more accurate average price per category name by correctly joining the products and categories collections.

### 5. add() and rate() Method

1. add Function:
   - Mongoose automatically handles the creation of the `ObjectId` for the newly saved product (`savedProduct._id`).
   - When updating categories, Mongoose correctly interprets the `productData.categories` array (which should contain category ObjectIds) in the `$in` operator.
2. rate Function:
   - The updated code implicitly relies on Mongoose to cast `productID` and `userID` to ObjectIds when querying (`ReviewModel.findOne`) and creating new documents (`new ReviewModel`).
   - The explicit creation of `new ObjectId()` for `productID ` and `userID` was removed, making the code cleaner as Mongoose handles this automatically due to the schema definition.

### 🔄 Minor Change in 'product.controller.js' file

### filterProducts(req, res) Method

The change in the `filterProducts` controller function is the name of the variable that holds the category information from the query parameters.

#### Before:

```javascript
const category = req.query.category;
// ... passed 'category' to the repository
```

#### After:

```javascript
const categories = req.query.categories;
// ... passed 'categories' to the repository
```

The variable name was updated from `category` (singular) to `categories` (plural) to align with the expectation that you are now sending an array of category IDs from **Postman**. This change ensures that the controller correctly extracts the category information from the request query parameters and passes it to the `productRepository.filter` function, which is also now expecting a `categories` argument.

## CartItems Feature - Updated

Moved existing code from `cartItems.repository.js` to `cartItems.repository_old.js`, and updated code to a fresh `cartItems.repository.js` file

### 🔄 New Code in 'cartItems.repository.js' file

```javascript
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
```

The original `CartItemsRepository` interacted directly with the MongoDB driver. The following changes refactor the repository to leverage Mongoose, an Object Data Modeling (ODM) library for MongoDB and Node.js. This brings several advantages, including schema definition, data validation, and simplified database interactions through Mongoose models.

1. Mongoose Integration:
   - The repository now imports the `mongoose` library, which is fundamental for using Mongoose features.
2. Model Definition:
   - A Mongoose model, `CartItemModel`, is created using the provided `cartItemSchema`. This model acts as an interface for interacting with the `cartItems` collection and enforces the defined schema.
3. `add` Function (Improved Data Handling):
   - `CartItemModel.findOne()` is used to efficiently check if a product already exists in a user's cart, using the Mongoose model for querying.
   - `CartItemModel.updateOne()` provides a more direct way to modify the quantity of an existing item.
   - For new items, a `CartItemModel` instance is created, and its `.save()` method is used, which handles the insertion into the database according to the defined schema.
4. `get` Function (Simplified Data Retrieval and Population):
   - `CartItemModel.find()` offers a cleaner syntax for retrieving cart items for a specific user.
   - The addition of `.populate('productID').populate('userID')` demonstrates Mongoose's ability to easily fetch related data from the `Product` and `User` collections, making it more efficient to retrieve complete cart information.
5. `delete` Function (Direct Document Removal):
   - `CartItemModel.deleteOne()` provides a straightforward way to remove a specific cart item using its `_id` and the `userID` for verification.
6. `getNextCounter` Removal (Leveraging Mongoose Defaults):
   - The custom counter mechanism for generating `_id` values is removed. Mongoose automatically handles the generation of unique `_id` ObjectIds, simplifying the repository code.

In summary, using Mongoose makes the CartItemsRepository cleaner and easier to work with by providing a more structured way to interact with MongoDB through models, simplifying data handling and database operations.

## Order Feature - Updated

### 1. 🆕 Created 'order.schema'js' file

```javascript
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
```

This is a **Mongoose schema** that defines the structure of an **Order** document in a MongoDB database. It ensures that all orders follow a consistent format.
🧱 Schema Fields Explained:

1. `userID`
   - 🔗 Stores a reference to the user who placed the order.
   - Uses ObjectId to link to a document in the User collection.

- required: true means every order must belong to a user.

2. `totalAmount`
   - 💰 The total price for the whole order.
   - Calculated by adding up the cost of all items (price × quantity).
   - Required field.
3. `timestamp`
   - 🕒 Records when the order was placed.
   - Automatically gets the current date/time if not provided.
4. `items` (Array of objects)
   - This is an array — each object inside it represents a product in the order.
   1. `productID`
      - Links to the actual product.
      - Helps you fetch product details using populate().
   2. `quantity`
      - Number of units ordered for that product.
      - Number of units ordered for that product.
   3. `price`
      - Stores the price at the time of order.
      - Useful for keeping historical pricing, even if the product price changes later.

✅ Why This Design Is Good

- Follows database normalization by referencing related collections.
- Captures order history reliably (thanks to price and timestamp).
- Easy to expand (you could add delivery status, shipping address, etc.).

### 2. 🔄 New Code in 'order.repository.js' file

Moved existing code from `order.repository.js` to `order.repository_old.js`, and updated code to a fresh `order.repository.js` file.

```javascript
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
      session.endSession();
    } catch (error) {
      // Rollback transaction on failure
      await session.abortTransaction();
      session.endSession();
      console.error("Error placing order:", error);
      throw new ApplicationError("Order Failed!", 500);
    }
  }
}
```

This code defines a OrderRepository class with a method placeOrder that handles the process of creating a new order based on the user's cart items.

1. Imports:
   - `mongoose`: The MongoDB ODM (Object Data Modeling) library for Node.js.
   - `ApplicationError`: A custom error class (presumably defined elsewhere in your project) for handling application-specific errors.
   - `orderSchema`, `productSchema`, `cartItemSchema`: Mongoose schemas defining the structure of the respective MongoDB documents.
2. Model Definitions
   - `OrderModel`: A Mongoose model for the 'Order' collection, based on the `orderSchema`.
   - `CartItemModel`: A Mongoose model for the 'CartItem' collection, based on the `cartItemSchema`.
   - `ProductModel`: A Mongoose model for the 'Product' collection, based on the `productSchema`.
3. OrderRepository Class: This class encapsulates the logic for order-related database operations.

   - placeOrder(userID) Method:

     - Takes userID as input, representing the user placing the order.
     - **Starts a MongoDB Transaction:**
       ```javascript
       const session = await mongoose.startSession();
       session.startTransaction();
       ```
       This ensures atomicity of the operations within the `try` block. If any operation fails, all changes will be rolled back.
     - **`try` Block: Contains the sequence of operations to place the order:**

       1. Fetch Cart Items:
          ```javascript
          const cartItems = await CartItemModel.find({ userID })
            .populate("productID")
            .session(session);
          ```
          - Finds all `CartItem` documents associated with the given `userID`.
          - `.populate("productID")` fetches the full `Product` document for each cart item by referencing the `productID` field in the `CartItem` schema.
          - `.session(session)` makes this read operation part of the current transaction.
       2. Handle Empty Cart:
          ```javascript
          if (!cartItems || cartItems.length === 0) {
            throw new Error("Cart is empty");
          }
          ```
          - If no items are found in the cart, it throws an error.
       3. Process Cart Items:

          ```javascript
          let finalTotalAmount = 0;
          const orderItems = [];

          for (const cartItem of cartItems) {
            const product = cartItem.productID;
            const quantity = cartItem.quantity;

            if (!product || product.stock < quantity) {
              throw new Error(
                `Insufficient stock for product: ${product.name}`
              );
            }

            finalTotalAmount += product.price * quantity;

            orderItems.push({
              productID: product._id,
              quantity,
              price: product.price,
            });
          }
          ```

          - Iterates through each `cartItem`.
          - Retrieves the associated `product` and `quantity`.
          - Checks if there is sufficient `stock` for the requested `quantity`. If not, it throws an error.
          - Calculates the `finalTotalAmount` of the order.
          - Creates an `orderItems` array, which will be part of the `Order` document, containing details about each product in the order.

       4. Create New Order:

          ```javascript
          const newOrder = new OrderModel({
            userID,
            totalAmount: finalTotalAmount,
            items: orderItems,
            timestamp: new Date(),
          });

          await newOrder.save({ session });
          ```

          - Creates a new `OrderModel` instance with the `userID`, calculated `totalAmount`, `orderItems`, and a timestamp.
          - Saves the new order to the database within the current transaction.

       5. Update Product Stock:
          ```javascript
          for (const cartItem of cartItems) {
            await ProductModel.updateOne(
              { _id: cartItem.productID._id },
              { $inc: { stock: -cartItem.quantity } },
              { session }
            );
          }
          ```
          - Iterates through the `cartItems` again.
          - For each item, it updates the `stock` of the corresponding `Product` by decrementing it by the ordered `quantity`. This update is also part of the transaction.
       6. Clear User's Cart:
          ```javascript
          await CartItemModel.deleteMany({ userID }, { session });
          ```
          - Deletes all `CartItem` documents associated with the `userID`, effectively clearing the user's cart. This operation is also within the transaction.
       7. Commit Transaction:
          ```javascript
          await session.commitTransaction();
          session.endSession();
          ```
          - If all operations in the try block succeed, the transaction is committed, making all the changes permanent in the database.

     - **`catch` Block: Handles any errors that occur within the `try` block.**
       ```javascript
       await session.abortTransaction();
       session.endSession();
       console.error("Error placing order:", error);
       throw new ApplicationError("Order Failed!", 500);
       ```
       - If an error occurs, the transaction is aborted, rolling back any changes made during the transaction.
       - The error is logged to the console.
       - An ApplicationError with a generic "Order Failed!" message and a 500 status code is thrown.
     - **`finally` Block: Ensures cleanup after transaction attempt**
       ```javascript
       finally {
         session.endSession();
       }
       ```
       - This block always executes after the `try` and `catch` blocks, regardless of success or failure i.e no matter what happens during the transaction.
       - It ensures that the MongoDB session is properly closed, preventing resource leaks or open database sessions.
       - By using `finally`, we avoid repeating `session.endSession()` in both try and catch blocks.

This code provides a robust way to handle order placement by ensuring data consistency through the use of MongoDB transactions. It fetches cart items, verifies stock, creates a new order, updates product stock, and clears the cart, all within a single atomic operation. If any step fails, the entire operation is rolled back.

### Note: The 'User' and 'Like' Features were already implemented and functioning correctly using Mongoose.

## Add-Stock Functionality for Products

### 1. Updated 'product.schema.js' file

```javascript
import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: String,
  desc: String,
  price: Number,
  imageUrl: String,
  sizes: [String],
  stock: {
    type: Number,
    default: 0,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
```

#### Updated stock field:

- `type: Number` —> ensures the stock value must be a number (as before).
- `default: 0` —> sets the initial stock to `0`if not explicitly provided when creating a new product.

#### 🚀 Why this is better:

- Prevents `undefined` or `null` stock values.
- Ensures **data consistency ** — every new product starts with zero stock unless specified.
- Makes inventory logic more predictable and bug-free in production systems.

### 2. Updated 'product.model.js' file

```javascript
export default class ProductModel {
  constructor(name, desc, price, imageUrl, categories, sizes, stock, id) {
    this._id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageUrl = imageUrl;
    this.categories = categories;
    this.sizes = sizes;
    this.stock = stock;
  }
}
```

The only updated part in your ProductModel class is the addition of the stock field in the constructor:

- `this.stock = stock;`
  This line assigns a stock value to the product instance, allowing you to track inventory in your application.
- It complements your earlier schema change where you added `stock` in the MongoDB model with a default of 0.

💡 Why this is useful:

- Now, every product instance in your application can hold and display stock information.
- It's critical for features like **stock display, stock updates, "out of stock" labels, and inventory management**.

### 3. Updated 'product.routes.js' file

```javascript
// http://localhost:3000/api/products/<productID>/add-stock
productRouter.patch("/:id/add-stock", (req, res) => {
  productController.addProductStock(req, res);
});
```

#### 🔍 What it does:

- Route: `PATCH /:id/add-stock`
- Purpose: Adds stock to a specific product identified by its `id`.
- Controller Method Called: `addProductStock(req, res)`
- HTTP Method: `PATCH` — suitable because it's partially updating an existing resource (just the stock count, not the whole product).

#### 📦 Use Case:

- Used in inventory management to increase the available stock of a product.
- Example: Admin restocking items without modifying other product details.

#### Postman Request Type: PATCH

🔗 URL:

```bash
http://localhost:3000/api/products/663f2e2e8c3a9b001f65da56/add-stock
```

📝 Body (JSON):

```json
{
  "stock": 100
}
```

### 4. Updated 'product.controller.js' file

The updated part of the code introduces a new method `addProductStock` and modifies the `addProduct` method to include the `stock` field when creating a new product.

1. `addProductStock()` Method

   ```javascript
   async addProductStock(req, res) {
       try {
         const productId = req.params.id;
         const { quantity } = req.body;

         if (quantity === undefined || typeof quantity !== "number") {
           return res
             .status(400)
             .send(
               "Please provide a valid 'quantity' to add to stock in the request body."
             );
         }

         const updatedProduct = await this.productRepository.addStock(
           productId,
           quantity
         );

         if (!updatedProduct) {
           return res.status(404).send("Product not found.");
         }
         res.status(200).send(updatedProduct);
       } catch (error) {
         console.error(error);
         return res.status(500).send("Something went wrong while adding stock.");
       }
     }
   ```

   - Purpose: This method is used to add stock to an existing product.
   - Parameters:
     - `req.params.id`: The `id` of the product (URL parameter).
     - `req.body.quantity`: The quantity to be added to the product's stock.
   - Functionality:
     - Checks if the `quantity` provided in the request body is a valid number.
     - Calls the `addStock` method from the `ProductRepository` to update the product's stock.
     - Returns the updated product if the stock is added successfully, otherwise returns a `404` error if the product is not found.
     - If there is any issue in adding the stock, a `500` error is returned with a generic message.

2. addProduct Method:

   ```javascript
   async addProduct(req, res) {
     try {
       const { name, desc, price, imageUrl, categories, sizes, stock } =
         req.body;

       // ... (category and size conversion logic)

       const newProduct = new ProductModel(
         name,
         desc || "No description available",
         parseFloat(price),
         req.file ? req.file.filename : imageUrl,
         categoriesArray,
         sizesArray,
         stock
       );

       // Call the repository method to add the new product to the database
     } catch (err) {
       console.log(err);
       return res.status(500).send("Something went wrong");
     }
   }
   ```

   - Change: The addProduct method now accepts a stock field in the request body and includes it when creating the product instance.
   - How it works:
     - If the stock field is provided in the request body, it is used when creating a new product.
     - The ProductModel is now initialized with the stock value, which was not included in the previous version.

### 5. Updated 'product.repository.js' file

```javascript
async addStock(productId, quantityToAdd) {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { stock: quantityToAdd } },
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    console.error("Error adding stock:", error);
    throw new ApplicationError("Failed to add stock to product.", 500);
  }
}
```

The updated part of the code is the `addStock` method within the `ProductRepository` class.

- Purpose: This method is used to update the stock quantity of a specific product in the database.
- Parameters:
  - `productId`: The ID of the product whose stock needs to be updated.
  - `quantityToAdd`: The quantity by which the stock will be incremented.
- Functionality:
  - `findByIdAndUpdate`: This is a Mongoose method that searches for the product by its productId and updates the stock field.
  - `$inc: { stock: quantityToAdd }`: This is a MongoDB operator that increments the stock field by the specified quantity. If `quantityToAdd` is a positive number, it will increase the stock; if negative, it will decrease it.
  - `{ new: true }`: This option ensures that the updated document (the product with the new stock value) is returned after the update operation.
- Error Handling: If any error occurs during the update (e.g., product not found or database issues), it will log the error and throw a custom `ApplicationError` with an appropriate error message.

This method is used in scenarios where the stock of a product needs to be incremented, such as when new units of a product are added to inventory.
