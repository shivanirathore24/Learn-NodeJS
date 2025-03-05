## ADDING MORE FEATURES TO E-COMMERCE APPLICATION

## Rate Products

Implementing the functionality to rate products in our Node.js E-commerce API.

1.  To enable rating functionality, we need to make changes in our product model. We
    already have three default products in our system, and we want to allow users to
    update or add ratings to these products.

2.  Create a new function called `rateProduct` in the product model. This function will
    take three parameters: `userID` (the ID of the user who wants to rate the product),
    `productID` (the ID of the product to be rated), and `rating` (the rating out of five
    stars).

    This code defines a static method `rateProduct` that is responsible for validating and updating the rating of a product by a user.

#### 'product.model.js' file
```javascript
static rateProduct(userID, productID, rating) {
    // 1. Validate User
    const user = UserModel.getAll().find((u) => u.id == userID);
    if (!user) {
      return "User not found";
    }
    // 1. Validate Product
    const product = products.find((p) => p.id == productID);
    if (!product) {
      return "Product not found";
    }

    // 3. Validate Rating Input
    if (!rating || isNaN(rating)) {
      return "Please provide a valid rating.";
    }

    // 4. Check if there are ratings and if not then add rating array.
    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({
        userID: userID,
        rating: rating,
      });
    } else {
      // 5. Check if user rating is already exists
      const existingRatingIndex = product.ratings.findIndex(
        (r) => r.userID == userID
      );

      if (existingRatingIndex >= 0) {
        // 6. Update the existing rating
        product.ratings[existingRatingIndex] = {
          userID: userID,
          rating: rating,
        };
      } else {
        // 7. Add new rating if not already rated
        product.ratings.push({
          userID: userID,
          rating: rating,
        });
      }
    }
  }
```

### Explanation:

Let's go through the code step by step:

- Validate user and product: 
  - The code first tries to find the user with the given `userID` in the `UserModel`.
  If the user is not found, it returns the string 'User not found'. 
  - Next, it tries to find the product with the given `productID` in the `products`
  array. If the product is not found, it returns the string `'Product not found'`.

- Check if there are any ratings and if not, add ratings array 
  - If the `product` object does not have a `ratings` property (or if it exists but is
  `null` or `undefined`), a new empty array is assigned to `product.ratings`. 
  - Then, a new rating object is created with the `userID` and `rating` provided,
  and it is pushed to the `product.ratings` array.
- Check if user rating is already available: 
  - If the `product.ratings` array exists and is not empty, the code searches for an
  existing rating in the array that matches the given `userID`. It does this by
  using the `findIndex` method, which returns the index of the first element that
  satisfies the provided condition. 
  - If an existing rating is found (i.e., `existingRatingIndex >= 0`), the code
  updates the rating for that user by replacing the existing rating object with a
  new rating object containing the updated `userID` and `rating`.

- If no existing rating is found: 
  - If there is no existing rating for the user in the `product.ratings` array, a new
  rating object is created with the `userID` and `rating` provided, and it is
  pushed to the `product.ratings` array.

3.  After implementing the rating functionality in the product model, we need to call
    this function from our controller and update the corresponding route.
    This code defines a controller `rateProduct` in product.controller.js file:

#### 'product.controller.js' file
```javascript
rateProduct(req, res) {
    console.log(req.query);
    const userID = req.query.userID;
    const productID = req.query.productID;
    const rating = req.query.rating;
    const error = ProductModel.rateProduct(userID, productID, rating);
    if (error) {
      return res.status(400).send(error);
    } else {
      return res.status(200).send("Rating has been added !");
    }
  }
```

4. This code defines the route for rate api in 'product.routes.js':

```javascript
productRouter.post("/rate", productController.rateProduct);
```

## Testing Rate API

Testing the API we created to rate products in our e-commerce application. The rate
product API takes three parameters: user ID, product ID, and rating. It applies the
rating to the existing products in our application.

### Testing Process

To test the API, we will use Postman. The following steps outline the testing process:

1. Run the API using the Node Server command.
2. Sign in as a customer user since customers should be rating the products.
3. Obtain the authentication token from the sign-in response.

<img src="./images/customerSignIn_JWTokenGenerated.png" alt="JWT Authentication Token on SignIn" width="650" height="auto">

4. In Postman, create a new request and set the request method to POST. Add the
   required query parameters: `userID`, `productID`, and `rating`. Include the
   authentication token in the request header using the "Authorization" key.

<img src="./images/customer_ratingMissing.png" alt="User added Rating on Products" width="650" height="auto">

<img src="./images/customer_rateProduct.png" alt="User added Rating on Products" width="650" height="auto">

5. Send the request and observe the response.

<img src="./images/customerRating_InProductsAdded.png" alt="Rating added on Product" width="650" height="auto">


## Adding Cart Feature
Implementing an important feature required for an e-commerce application:
managing the cart. The cart feature allows users to add items to their cart, which is a
fundamental functionality in e-commerce applications. We will create an API to add
items to the cart.
### 1. Creating the Cart Items Model
1. Create a new folder named "cartItems" to organize the cart-related code.
2. In the "cartItems" folder, create a model file named "cartItems.model.js" to define
the
Cart Item model.
3. The Cart Item model will have the following properties:
    - productID: Represents the ID of the product added to the cart.
    - userID: Represents the ID of the user who added the product to the cart.
    - quantity: Represents the quantity of the product in the cart.
4. Export a class named CartItemModel as the default export.
5. Define a constructor in the CartItemModel class to initialize the productID,
userID, and quantity properties.
6. Optionally, you can add some existing cart items as examples by instantiating the
CartItemModel class with predefined values.
7. Implement an add function in the CartItemModel class to add new items to the
cart
    - The add function takes productID, userID, and quantity as parameters.
    - Instantiate the CartItemModel class with the provided values and push it into
  an array of cart items.
    - Return the newly added cart item.

#### 'cartItems.model.js' file:
```javascript
export default class CartItemsModel {
  constructor(id, productID, userID, quantity) {
    this.id = id;
    this.productID = productID;
    this.userID = userID;
    this.quantity = quantity;
  }

  static add(productID, userID, quantity) {
    const cartItem = new CartItemsModel(
      cartItems.length + 1,
      productID,
      userID,
      quantity
    );
    cartItems.push(cartItem);
    return cartItem;
  }
}

var cartItems = [new CartItemsModel(1, 2, 1, 3)];
```
### 2. Creating the Cart Items Controller
1. In the "cartItems" folder, create a controller file named "cartItemsController.js"
to handle cart-related operations.
2. Export a class named `CartItemsController` as the default export.
3. Implement an `add` method in the `CartItemsController` class to handle the
addition of items to the cart.
    - The `add` method takes a `request` and `response` as parameters.
    - Extract the `productID` and `quantity` from the request's query
  parameters.
    - Retrieve the `userID` from the request object's `userID` property
  (accessed from the token).
    - Import the `CartItemModel` and call its `add` function with the
  `productID`, `userID`, and `quantity` parameters.
    - Return a response with a status code of 201 (Created) and a message
  indicating that the cart is updated.

#### 'cartItems.controller.js' file:
```javascript
import CartItemsModel from "./cartItems.model.js";
export class CartItemsController {
  add(req, res) {
    const { productID, quantity } = req.query;
    const userID = req.userID;
    CartItemsModel.add(productID, userID, quantity);
    res.status(201).send("Cart is updated");
  }
}
```

### 3. Creating the Cart Items Routes
1. In the "cartItems" folder, create a routes file named "cartItems.routes.js" to
define the routes related to cart items.
2. Import the necessary dependencies, such as Express and the
`CartItemsController`.
3. Create an instance of the Express Router and assign it to a variable named
`cartRouter`.
4. Instantiate the `CartItemsController`.
5. Set up the route for adding a new item to the cart using the POST method.
    - Specify the route path as "/add".
    - Call the `add` method of the `CartItemsController` for this route.
  6. Export the `cartRouter` as the default export.
#### 'cartItems.routes.js' file:
```javascript
// Manage routes/paths to CartItemsController
// 1. Import express
import express, { Router } from "express";
import { CartItemsController } from "./cartItems.controller.js";

// 2. Initialize Express router
const cartRouter = express.Router();
const cartItemsController = new CartItemsController();

// 3. Routes related to the controller methods.
cartRouter.post("/", cartItemsController.add);

export default cartRouter;
```

### 4. Setting Up Server Configuration
1. In the main server file, import the `cartRouter` from the cart items routes file.
2. Add a middleware for the cart-related APIs to use the `cartRouter`.
3. Ensure that the cart-related APIs are secured by adding a JWT authentication
middleware.
#### Changes in 'server.js' file:
```javascript
import cartRouter from "./src/features/cartItems/cartItems.routes.js";

server.use("/api/cartItems", jwtAuth, cartRouter); // CartItems-related routes
```

### 4. Extracting UserID from JWT token
#### 💡 Why Is This Important?
When making a request, For example: http://localhost:3000/api/cartItems?productID=1&quantity=2, the userID is not passed as a query parameter i.e  (?userID=1) in the URL. Instead, it is now extracted from the JWT token and set in the req object.

This ensures that the userID is securely obtained from the authenticated user's token, avoiding reliance on potentially tampered client-side data.

#### Change in 'jwtAuth.middleware.js' file:
```javascript
 try {
    // 4. Verify the token using the secret key and log the decoded payload
    const payload = jwt.verify(token, "N6BUpqT7VL8cI7VbzLHaaS9txwGJWZMR");
    req.userID = payload.userID;   //added
    console.log(payload);
  } catch (err) {
    // 5. Log token verification errors and send 'Unauthorized' response
    console.error("Token Error: Invalid or expired token", err.message);
    return res.status(401).send("Unauthorized: Invalid or expired token");
  }
```
