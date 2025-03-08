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
When making a request, For example: http://localhost:3100/api/cartItems?productID=1&quantity=2, the userID is not passed as a query parameter i.e  (?userID=1) in the URL. Instead, it is now extracted from the JWT token and set in the req object.

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

## Testing Cart Feature
We will test this API and proceed to create another API to retrieve the items in the
user's cart.
### Testing the Add Item to Cart API
1. Start by running the server to test the API's functionality.
2. Open Postman and log in with the user credentials.
3. Create a new request for adding an item to the cart:
    - Set the request method to POST.
    - Add the authorization header with the token.
    - Set the request URL as "/API/cart-items" (or the appropriate endpoint).
    - Add the required query parameters: "productID" and "quantity".
    - Example: productID=1, quantity=2.
4. Send the request and verify that the response shows a "Cart is updated"
message.

 <img src="./images/customerSignIn_JWTokenCreated.png" alt="User SignIn JWT Token Created" width="650" height="auto">

  <img src="./images/addCartItems.png" alt="Add Cartitems" width="650" height="auto">
  
5. At this point, there is no direct way to confirm the update, so we will proceed
to implement an API for retrieving the cart items.


### Implementing the Get Cart Items API
1. Modify the model to include a function that returns all cart items for a specific
user.
    - Create a function called `get` that takes the `userID` as a parameter.
    - Filter the cart items array based on the provided `userID`.
    - Return the filtered cart items.
  ```javascript
  static get(userID) {
    return cartItems.filter((i) => i.userID == userID);
  }
  ```
2. In the controller, create a method called `get` to handle retrieving cart items.
    - The method should take a `request` and `response` as parameters.
    - Retrieve the `userID` from the token stored in the request object.
    - Call the `get` function from the model, passing the `userID`.
    - Return a response with a status code of 200 and send the cart items as the response body
  ```javascript
  get(req, res) {
    const userID = req.userID;
    const items = CartItemsModel.get(userID);
    return res.status(200).send(items);
  }
  ```
### Testing the Get Cart Items API
1. In Postman, create a new request to test the Get Cart Items API.
2. Set the request method to GET.
3. Add the authorization header with the token.
4. Set the request URL to the appropriate endpoint ("/api/cart-items" or similar).
5. Send the request and verify that the response shows the cart items specific to
the logged-in user.
6. The response should only include the cart items belonging to the user with the
associated user ID.
  <img src="./images/getCartItems.png" alt="Get User Specific CartItems" width="650" height="auto">

## Deleting Cart Item

We will add another API related to the cart feature, allowing users to delete existing
cart items.
Implementing the Delete Cart Item API

1. Create a `delete` function in the model that takes the `cartItemID` and `userID` as a parameter.
   - Use the `find` method to search for the cart item with the matching ID.
   - If the cart item is not found, return an error message.
   - If the cart item is found, find its index using `findIndex`.
   - Use the `splice` function to remove the cart item from the `cartItems` array.

```javascript
static delete(cartItemID, userID) {
    const cartItemIndex = cartItems.findIndex(
      (i) => i.id == cartItemID && i.userID == userID
    );
    if (!cartItemIndex == -1) {
      return "Item not found!";
    } else {
      cartItems.splice(cartItemIndex, 1);
    }
}
```

2. In the controller, create a `delete` method to handle deleting a cart item. 
    - Accept the `request` and `response` parameters. 
    - Retrieve the `userID` from the token stored in the request object. 
    - Retrieve the `cartItemID` from the request parameters. 
    - Call the `delete` function from the model, passing the `cartItemID` and `userID`. 
    - Implement a validation to ensure that the user is deleting their own cart items. 
    - Return an error message if the validation fails. 
    - Return a response with a status code of 404 (Resource Not Found) if the cart
   item is not found. 
    - Return a response with a status code of 200 (Success) and a message
   stating that the cart item has been removed.

```javascript
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
```

### Testing the Delete Cart Item API
1. Run the server and ensure that the cart items are present in the application.
2. In Postman, create a new request for deleting a cart item.
3. Set the request method to DELETE.
4. Add the authorization header with the token.
5. Set the request URL to the appropriate endpoint ("/API/cart-items/:id" or
similar).
6. Replace `:id` with the ID of the cart item you want to delete.
7. Send the request and verify that the response shows a "cart item is removed"
message.
<img src="./images/deleteCartItem.png" alt="Delete Cart Item" width="650" height="auto">

8. To verify the deletion, send a GET request to retrieve the cart items and
confirm that the deleted item is no longer present.

<img src="./images/getCartItems_afterDelete.png" alt="Get User Specific CartItems" width="650" height="auto">

## API Documentation
We will discuss the importance of API documentation and how it helps clients
understand and use our APIs effectively. We will explore the OpenAPI specification,
which provides a standardized means to define and document APIs. Additionally, we
will introduce Swagger as a popular tool for implementing API documentation.
### The Need for API Documentation
1. Clients need clear instructions on how to use APIs.
2. As developers, we may not know who our clients will be.
3. API documentation makes it easier for clients to understand and use our APIs.

### OpenAPI Specification
1. [OpenAPI](https://www.openapis.org/) is a widely adopted specification for documenting APIs.
2. It provides a standardized way to define APIs and communicate their
functionality to clients.
3. OpenAPI allows clients to quickly understand how an API works, configure
infrastructure, generate client code, and create test cases.
### Swagger for API Documentation
1. [Swagger](https://swagger.io/) is an implementation of the OpenAPI specification.
2. It helps developers create interactive API documentation for their APIs.
3. Swagger provides a user-friendly interface that allows clients to explore and understand the API's endpoints, request methods, parameters, and responses.

### Example: COVID Vaccination API Documentation
1. Government of India provided an API for booking COVID vaccination
appointments.
2. Applications like Paytm and Arogya Setu implemented this API to enable
appointment bookings.
3. The API documentation followed the Swagger format.
4. Clients could understand the API endpoints, request methods, parameters,
request/response formats, and error codes through the Swagger
documentation

<img src="./images/cowin_api_swagger.png" alt="CoWin API Swagger" width="600" height="auto">


## Using Swagger

Implementing Swagger in our Node.js API application. Swagger is a tool that helps
us generate API documentation and provides a user-friendly interface for clients to
understand and interact with our APIs.

### Installing Swagger UI Express

- We will use the `swagger-ui-express` package to implement Swagger in our
  application. (Link)
- Install the package using the command: `
```bash
  npm install swagger-ui-express
```

### Creating a Swagger JSON File

1. Create a JSON file called `swagger.json` to define the API documentation.
2. Start by specifying the Swagger version as 2.0.
3. Provide basic information about your API, including the version, description,
  and title.
4. Define the `host` where your API is hosted (e.g., `localhost:3100`).
5. Specify the paths for your API endpoints (e.g., `/api/products`,
  `/api/users/signin`).
6. For each path, define the request methods (e.g., GET, POST) and include a
  summary and description.
7. Define the parameters for each request, such as query parameters or request
  body.
8. Specify the expected responses for each request, including status codes and
  descriptions.

#### swagger.json file:

```json
{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "description": "API for E-Commerce application",
    "title": "E-commerce API"
  },
  "host": "localhost:3100",
  "paths": {
    "/api/users/signin": {
      "post": {
        "tags": ["Users"],
        "summary": "Login",
        "description": "User login to get token",
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "User Credentials",
            "schema": {
              "type": "object",
              "properties": {
                "email": {
                  "type": "string"
                },
                "password": {
                  "type": "string"
                }
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Invalid Credentials !"
          }
        }
      }
    }
  }
}
```

### Configuring Swagger in the Express Server

1. Import the `swagger-ui-express` and `swagger.json` files into your Express
  server.
2. Create a route (e.g., `/api-docs/` or `/api/docs`) to expose the Swagger UI.
3. Use the `swagger.serve` middleware to create the Swagger UI.
4. Configure the Swagger UI using `swagger.setup` and pass the imported
  `swagger.json` object

```javascript
import swagger from "swagger-ui-express";
import apiDocs from "./swagger.json" with { type: "json" };

server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
```

### Testing the Swagger UI

- Start the server and navigate to the Swagger UI route (e.g.,
  `http://localhost:3100/api-docs/`).
- Verify that the Swagger UI displays your API documentation.
- Clients can now use the Swagger UI to explore and test your API directly from
  the browser

<img src="./images/swagger_api_docs1.png" alt="API Docs Swagger" width="700" height="auto">

<img src="./images/swagger_post_api_users_signin.png" alt="Swagger User SignIn" width="700" height="auto">
