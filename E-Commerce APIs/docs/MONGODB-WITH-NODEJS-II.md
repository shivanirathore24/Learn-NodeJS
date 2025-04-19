## MONGODB WITH NODEJS PART-II

## Cart Repository

### 1. Created 'cartItems.repository.js' file

```javascript
import { ObjectId } from "mongodb";
import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartItemsRepository {
  constructor() {
    this.collection = "cartItems";
  }
  async add(productID, userID, quantity) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      await collection.insertOne({
        productID: new ObjectId(productID),
        userID: new ObjectId(userID),
        quantity,
      });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async get(userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find({ userID: new ObjectId(userID) }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }

  async delete(cartItemID, userID) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        _id: new ObjectId(cartItemID),
        userID: new ObjectId(userID),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Data", 500);
    }
  }
}
```

This code defines a repository class called CartItemsRepository, which is responsible for interacting with the MongoDB database to perform CRUD operations related to items in a user's shopping cart.

#### 1. 🧱 Structure of the Class:

- Class Name: CartItemsRepository
- Purpose: Encapsulate all logic to manage cart items in the database.
- Constructor: Sets the collection name to "cartItems" (the MongoDB collection that stores cart item documents).

#### 2.🔧 Dependencies

```javascript
import { ObjectId } from "mongodb";
```

Used to convert string IDs into MongoDB’s special ObjectId format, which is necessary for querying by ID.

```javascript
import { getDB } from "../../../config/mongodb.js";
```

Function that returns a connected instance of the MongoDB database.

```javascript
import { ApplicationError } from "../../error-handler/applicationError.js";
```

Custom error class to handle application-level errors cleanly and consistently.

#### 3. Methods

1. add(productID, userID, quantity)

   - 📌 Purpose: To add a product to the user's cart.
   - 🧠 Logic:
     - Converts the productID and userID (which are strings) into ObjectId because MongoDB stores IDs in this format.
     - insertOne() inserts a document into the cartItems collection like:
     ```javascript
         {
             "productID": ObjectId("..."),
             "userID": ObjectId("..."),
             "quantity": 2
         }
     ```
   - If any error occurs (e.g., database issue), it's caught and a custom ApplicationError is thrown.

2. get(userID)
   - 📌 Purpose: To retrieve all items in a specific user's cart.
   - 🧠 Logic:
     - Finds all documents in the cartItems collection where the userID matches the given one.
     - Converts the result from a cursor to an array using .toArray() and returns it.
     - This gives you a list of all products the user has added to their cart.
3. delete(cartItemID, userID)
   - 📌 Purpose: To delete a specific item from the user's cart.
   - 🧠 Logic:
     - Deletes a document that matches both:
       - \_id of the cart item (to ensure it’s the right item),
       - userID (to ensure it belongs to that user).
     - deleteOne() returns an object with deletedCount:
       - 1 if deletion was successful,
       - 0 if nothing matched.
     - Returns true if something was deleted, otherwise false.

#### 4. ⚠️ Common Error Handling

In every method, we have:

- Logs the error (for debugging).
- Throws a custom ApplicationError with a 500 HTTP status code to handle the issue gracefully.

### 2. Updated cartItems.controller.js file

#### Before Changes:

```javascript
import CartItemsModel from "./cartItems.model.js";
export class CartItemsController {
  add(req, res) {
    //const { productID, quantity } = req.query;
    /* Query parameters in req.query are always strings */
    const productID = Number(req.query.productID);
    const quantity = Number(req.query.quantity);
    const userID = req.userID;
    CartItemsModel.add(productID, userID, quantity);
    res.status(201).send("Cart is updated !");
  }

  get(req, res) {
    const userID = req.userID;
    const items = CartItemsModel.get(userID);
    return res.status(200).send(items);
  }

  delete(req, res) {
    const userID = req.userID;
    const cartItemID = req.params.id;
    const error = CartItemsModel.delete(cartItemID, userID);
    if (error) {
      return res.status(404).send(error);
    } else {
      return res.status(200).send("Cart Item is removed !");
    }
  }
}
```

#### After Changes:

```javascript
import CartItemsModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export class CartItemsController {
  constructor() {
    this.cartItemsRepository = new CartItemsRepository();
  }

  async add(req, res) {
    try {
      const { productID, quantity } = req.body;
      const userID = req.userID;
      await this.cartItemsRepository.add(productID, userID, quantity);
      res.status(201).send("Cart is updated !");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async get(req, res) {
    try {
      const userID = req.userID;
      const items = await this.cartItemsRepository.get(userID);
      return res.status(200).send(items);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async delete(req, res) {
    try {
      const userID = req.userID;
      const cartItemID = req.params.id;
      const isDeleted = await this.cartItemsRepository.delete(
        cartItemID,
        userID
      );
      if (!isDeleted) {
        return res.status(404).send("Item not found !");
      } else {
        return res.status(200).send("Cart Item is removed !");
      }
    } catch {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }
}
```

1. ✅ Constructor-Based Initialization

   ```javascript
   constructor() {
   this.cartItemsRepository = new CartItemsRepository();
   }
   ```

   - Why:Replaces direct CartItemsModel usage with an instance of CartItemsRepository.
   - Benefit:Makes the controller more modular, testable, and decoupled from the data layer.

2. ⏱️ Async/Await Implementation

   - All controller methods (add, get, delete) are now async.
   - Why: The repository methods return Promises —> await is used to handle asynchronous DB operations cleanly.

3. 📥 Input Source Changed: req.body Instead of req.query

   ```javascript
   const productID = Number(req.body.productID);
   const quantity = Number(req.body.quantity);
   ```

   - Why: Using req.body aligns with standard REST practices (especially for POST or PUT requests).
   - Before: Parameters were parsed from URL query string.
   - After: Parsed from request body (typically JSON).

4. 📦 Switched to Repository for Data Access

   ```javascript
   await this.cartItemsRepository.add(...)
   await this.cartItemsRepository.get(...)
   await this.cartItemsRepository.delete(...)
   ```

   - Why: Shifts responsibility from CartItemsModel to a more robust CartItemsRepository, aligning with repository pattern best practices.

5. ⚠️ Improved Error Handling
   ```javascript
   try {
   ...
   } catch (err) {
   console.log(err);
   return res.status(500).send("Something went wrong");
   }
   ```
   - Why: Wraps logic in try-catch blocks to catch exceptions and respond gracefully.
   - The 500 status code indicates a server-side error, helping clients distinguish between successful responses and failures for proper error handling.

### 3. Updated cartItems.routes.js file

#### Before Changes:

```javascript
cartRouter.post("/", cartItemsController.add);
cartRouter.get("/", cartItemsController.get);
cartRouter.delete("/:id", cartItemsController.delete);
```

#### After Changes:

```javascript
cartRouter.post("/", (req, res, next) => {
  cartItemsController.add(req, res, next);
});
cartRouter.get("/", (req, res, next) => {
  cartItemsController.get(req, res, next);
});
cartRouter.delete("/:id", (req, res, next) => {
  cartItemsController.delete(req, res, next);
});
```

- The update uses explicit middleware functions to pass `req`, `res`, and `next` to controller methods.
- Why Needed:

  - Ensures correct `this` context binding for the controller methods.
  - Allows proper error handling and middleware flow, especially for asynchronous operations.

- If Not Done:
  - `this` might be incorrectly bound, leading to errors.
  - Asynchronous errors may not be handled properly, causing unhandled promise rejections.

### 4. Testing in Postman

#### 1. Add CartItems

User-1: After Sign-In, and added two products to the cart.

<img src="./images/addCartItem_postman1.png" alt="Mongo Driver" width="650" height="auto">
<img src="./images/addCartItem_postman2.png" alt="Mongo Driver" width="650" height="auto">

User-2: After Sign-In, added a product to the cart.

<img src="./images/addCartItem_postman3.png" alt="Mongo Driver" width="650" height="auto">

Collection 'cartItems' in MongoDB

<img src="./images/addCartItem_MongoDBCompass.png" alt="Mongo Driver" width="650" height="auto">

#### 2. Get CartItems

Get CartItems by User-1

<img src="./images/user1_SignIn_postman.png" alt="Mongo Driver" width="650" height="auto">
<img src="./images/getCartItems_user1_postman.png" alt="Mongo Driver" width="650" height="auto">

Get cartItems by User-2

<img src="./images/user2_SignIn_postman.png" alt="Mongo Driver" width="650" height="auto">
<img src="./images/getCartItems_user2_postman.png" alt="Mongo Driver" width="650" height="auto">

#### 3. Delete CartItems

<img src="./images/deleteCartItem_postman1.png" alt="Mongo Driver" width="650" height="auto">
<img src="./images/deleteCartItem_MongoDBCompass.png" alt="Mongo Driver" width="650" height="auto">
<img src="./images/deleteCartItem_postman2.png" alt="Mongo Driver" width="650" height="auto">

## Update Quantity of CartItem

### 1. Updated 'cartItems.repository.js' file

The only changed part in updated `add` function is the database operation inside the try block.

#### Before Change:

```javascript
await collection.insertOne({
  productID: new ObjectId(productID),
  userID: new ObjectId(userID),
  quantity,
});
```

- What it does: Always inserts a new document into the database.
- Problem: If the same product for the same user is added again, it will create duplicate entries.

#### After Change:

```javascript
// Add a new product to the cart or update quantity if it already exists
await collection.updateOne(
  { productID: new ObjectId(productID), userID: new ObjectId(userID) },
  {
    $inc: {
      quantity: quantity,
    },
  },
  { upsert: true } // Insert new document if no match is found
);
```

What it does:

- Checks if a document exists with the given productID and userID.
- If it exists, it increments the quantity.
- If it does not exist, it inserts a new document (upsert: true).

#### ✅ Why the change was made?

1. To avoid duplicate entries for the same product-user pair.
2. To increase quantity if the item already exists.
3. Makes the add function smarter by handling both insert and update in one step.

### 2. Testing in Postman

#### Added a new product to the cart

<img src="./images/updateCartItem_postman1.png" alt="Mongo Driver" width="650" height="auto">
<img src="./images/updateCartItem_MongoDBCompass1.png" alt="Mongo Driver" width="650" height="auto">

#### Updated the quantity of an existing product in the cart

<img src="./images/updateCartItem_postman2.png" alt="Mongo Driver" width="650" height="auto">
<img src="./images/updateCartItem_MongoDBCompass2.png" alt="Mongo Driver" width="650" height="auto">
