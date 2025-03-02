## SECURING APIs

## Understanding Security

### Introduction to the next set of APIs

#### APIs to be created:

- Rate a product.
- Add products to a cart.
- Retrieve products from the cart.
- Remove a product from the cart.

### Need for User Authentication

- User authentication is required for user-specific actions.
- Actions such as adding items to the cart or placing orders require user
  identification.
- Without authentication, it becomes difficult for the system to determine
  user-specific actions.

### Reasons for Securing the Application

- Controlled access: Only logged-in users should access certain features.
- Data privacy: User data should not be accessible to everyone.
- Examples: Misuse of private data on social media platforms.

### How to Secure the Application

- Authentication and authorization are essential.
- Authentication verifies the identity of a user.
- Authorization determines what a user can access based on their privileges.

### Authentication and Authorization

<img src="./images/authentication_authorization.png" alt="Authentication and Authorization" width="600" height="auto">

### Types of Authentication

<img src="./images/types_of_authentication.png" alt="Types of Authentication" width="600" height="auto">

1. **Basic authentication:** Users provide credentials with each request.
2. **API keys:** Unique keys for user identification (used by third-party APIs).
3. **OAuth (Open Authentication):** Allows authentication using third-party
   applications (e.g., Google or Facebook).
4. **JWT (JSON Web Token):** Popular authentication method using tokens (more
   details in future videos).

## User APIs
### Securing REST API Application
- The first step towards securing the application is by creating two APIs for user
registration and login.
- Add two APIs to the user controller: one for sign up and another for sign in.
- The sign-up API will accept user details such as email, name, password, and
user type (customer or seller).
- The sign-in API will require the user to provide their email and password.
- Create a new folder named "user" inside the existing "features" directory.
- Within the "user" folder, three files are created: user.model.js,
user.controller.js, and user.routes.js.
<img src="./images/user_folder.png" alt="User Folder Structure" width="300" height="auto">

### 1.  user.model.js file
- The user.model.js file defines a User class with a constructor that takes
parameters for name, email, password, and user type.
- A default user is created with the name "Seller User," email
"seller@ecom.com," password "password1," and user type "seller."
```javascript
export class UserModel {
  constructor(id, name, email, password, type) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }

  static signUp(name, email, password, type) {
    const newUser = new UserModel(
      users.length + 1,
      name,
      email,
      password,
      type
    );
    users.push(newUser);
    return newUser;
  }

  static signIn(email, password) {
    const user = users.find((u) => u.email == email && u.password == password);
    return user;
  }
}

var users = [
  {
    id: 1,
    name: "Seller User",
    email: "seller@ecom.com",
    password: "password1",
    type: "seller",
  },
];
```

### 2. user.controller.js file
The user.controller.js file is created with a controller class that includes two
functions: signUp and signIn, which both take request and response
parameters.
```javascript
import { UserModel } from "./user.model.js";
export default class UserController {
  signUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = UserModel.signUp(name, email, password, type);
    res.status(201).send(user);
  }

  signIn(req, res) {
    const result = UserModel.signIn(req.body.email, req.body.password);
    if (!result) {
      return res.status(400).send("Invalid Credentials !");
    } else {
      return res.send("Login Successful !");
    }
  }
}
```

### 3. user.routes.js file
- In the user.routes.js file, create routes for user sign-up and sign-in.
- The routes for sign-up and sign-in are both POST requests.
```javascript
// Import necessary modules  
import express from "express";  
import UserController from "./user.controller.js";  

// Initialize router and user controller  
const userRouter = express.Router();  
const userController = new UserController();  

// Define authentication routes  
userRouter.post("/signup", userController.signUp); // User registration  
userRouter.post("/signin", userController.signIn); // User login  

export default userRouter;  

```

## Testing User APIs
We have to test the user sign-up and user sign-in APIs before proceeding to secure
other routes. Open Postman to perform the testing both sign-up and sign-in requests.

### SignUp API
- The URL for the sign-up request is specified as
"localhost:3100/api/users/signup"
- Set up the request body in Postman for the sign-up API. It should contain the
user's name, email, password, and type.
- Send the sign-up request. The response indicates that a new user has been
created with an ID of 2.

<img src="./images/user_signup_postman.png" alt="User SignUp" width="600" height="auto">

### SignIn API
- Test the sign-in API. The request body for sign-in only requires the user's
email and password.
- Provide a valid email and password, and send the request. The response
confirms a successful login with the message "Login successful"
  
<img src="./images/user_signin_successful.png" alt="User SignIn Successful" width="600" height="auto">

- If incorrect credentials are provided, the response will indicate a bad request
with the message "Invalid credentials."

<img src="./images/user_signin_invalid.png" alt="User SignIn Invalid" width="600" height="auto">



## Basic Authentication
1. Objective: Implement basic authentication to secure the APIs in the application.
2. Basic authentication mechanism:
    - Credentials (username and password) provided by the client will be checked
on each request.
    - Middleware named "basicAuth" will be used to simplify the authentication
process and ensure data validation against attacks like SQL injections.
    - The "express-basic-auth" package will be installed to set up basic
authentication.
3. Middleware Implementation:
    - Create a middleware named "basicAuth" in the "middlewares" folder.
    - he middleware will compare the received email and password with the user
data stored in the user model.
    - If the credentials do not match, an error will be returned.
    - If the credentials are correct, the middleware will proceed to the next
middleware.
    - Secure string comparison will be performed using the "safeCompare" function
to protect against timing attacks.

#### Code Implementation:
```javascript
import { UserModel } from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
  // 1. Check if the Authorization header is present in the request
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("No authorization details found!");
  }
  console.log("Authorization Header:", authHeader);

  // 2. Extract the Base64-encoded credentials from the Authorization header
  // The header format is "Basic <base64encodedCredentials>"
  const base64Credentials = authHeader.replace("Basic ", "");
  console.log("Base64 Credentials:", base64Credentials);

  // 3. Decode the Base64-encoded credentials to get the "username:password" format
  const decodeCreds = Buffer.from(base64Credentials, "base64").toString("utf8");
  console.log("Decoded Credentials:", decodeCreds); // Expected format: "username:password"

  // 4. Split the decoded string into username and password
  const creds = decodeCreds.split(":");
  if (creds.length < 2) {
    return res.status(401).send("Invalid authorization format");
  }

  // 5. Validate credentials against the user database
  const user = UserModel.getAll().find(
    (u) => u.email === creds[0] && u.password === creds[1]
  );

  // 6. If a valid user is found, proceed to the next middleware
  if (user) {
    console.log("Authorization successful for user:", creds[0]);
    next();
  } else {
    // 7. If credentials are invalid, return a 401 Unauthorized response
    return res.status(401).send("Incorrect Credentials");
  }
};

export default basicAuthorizer;
```

## Basic Authentication

### 1. Model (user.model.js):
Added static method of UserModel that returns all users (UserModel.getAll()).
```javascript
export class UserModel {
  // Other methods like signUp, signIn.
  
  static getAll() { return users; }
}

```

### 2. Middleware Logic (basicAuthorizer):

1. **Check Authorization Header:** Verify if the Authorization header exists.
2. **Extract Base64 Credentials:** Remove the "Basic " prefix.
3. **Decode Credentials:** Convert from Base64 to "username:password" format.
4. **Validate Format:** Ensure proper splitting into username and password.
5. **Authenticate User:** Match credentials against the user data (UserModel.getAll()).
6. **Grant or Deny Access:** If credentials match, call next(); otherwise, send a 401 Unauthorized response.

```javascript
import { UserModel } from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
  // 1. Check if the Authorization header is present in the request
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("No authorization details found!");
  }
  console.log("Authorization Header:", authHeader);

  // 2. Extract the Base64-encoded credentials from the Authorization header
  // The header format is "Basic <base64encodedCredentials>"
  const base64Credentials = authHeader.replace("Basic ", "");
  console.log("Base64 Credentials:", base64Credentials);

  // 3. Decode the Base64-encoded credentials to get the "username:password" format
  const decodeCreds = Buffer.from(base64Credentials, "base64").toString("utf8");
  console.log("Decoded Credentials:", decodeCreds); // Expected format: "username:password"

  // 4. Split the decoded string into username and password
  const creds = decodeCreds.split(":");
  if (creds.length < 2) {
    return res.status(401).send("Invalid authorization format");
  }

  // 5. Validate credentials against the user database
  const user = UserModel.getAll().find(
    (u) => u.email === creds[0] && u.password === creds[1]
  );

  // 6. If a valid user is found, proceed to the next middleware
  if (user) {
    console.log("Authorization successful for user:", creds[0]);
    next();
  } else {
    // 7. If credentials are invalid, return a 401 Unauthorized response
    return res.status(401).send("Incorrect Credentials");
  }
};

export default basicAuthorizer;
```
### 2. Applying Middleware in server.js
1. Import `basicAuthorizer` middleware.
2. Apply basicAuthorizer middleware to protected routes (/api/products).
3. Leave authentication open for /api/users routes (e.g., for signup/login).
```javascript
import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";

server.use("/api/products", basicAuthorizer, productRouter); 
```

#### NOTE:
- Protected Route: Only authorized users can access /api/products.
- Open Route: All users can access /api/users (for signup/login).
- Authorization Logic: Only proceeds if credentials are correct.


### Testing Basic Authentication
1. Start the server using the command "node server.js" or "npm start" if using nodemon.
2. Use Postman for API testing. The "API products" request is selected, which
has been secured by the authorizers.
3. Accessing the API without providing any credentials results in a 401
unauthorized response, indicating the lack of authorization.

<img src="./images/noauth_filterProducts_postman.png" alt="No Authentication " width="650" height="auto">

<img src="./images/noauth_getProducts_postman.png" alt="No Authentication " width="650" height="auto">

4. Basic authentication credentials (username and password) are added to the
Postman request under the Authorization tab.
5. The "Basic Auth" option is selected, and the username and password are
entered.
6. Upon sending the request with the correct credentials, the data (all the
products & products based on the filter) is successfully retrieved.

<img src="./images/basicAuth_filterProducts_postman.png" alt="Authentication " width="650" height="auto">

<img src="./images/basicAuth_getProducts_postman.png" alt="Authentication " width="650" height="auto">

7. Request with incorrect credentials returns a 401 unauthorized response.

<img src="./images/basicAuth_invalidEmail_postman.png" alt="Invalid Credentials" width="650" height="auto">

<img src="./images/basicAuth_invalidPassword_postman.png" alt="Invalid Credentials" width="650" height="auto">

8. Basic authentication requires providing username and password with each
request to the server.
9. The server verifies the provided credentials for every incoming request,
granting access if the credentials are correct and returning an error response
if they are incorrect.






