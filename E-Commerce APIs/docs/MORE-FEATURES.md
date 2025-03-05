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
