## MONGODB WITH NODEJS PART-I

## MongoDB Driver

<img src="./images/mongodb_driver.png" alt="Mongo Driver" width="600" height="auto">

The MongoDB driver is a crucial link between your Node.js application and the
MongoDB database.

### Installation of MongoDB Driver
- It provides programming tools and interfaces that empower your application to
interact with MongoDB seamlessly.
- Install MongoDB driver by running the command: `npm i mongodb`


### Implementing MongoDB with NodeJS
Create a 'config' directory to establish a separation of configurations in our
project. Within this directory, create a 'mongodb.js' file to facilitate the
connection to MongoDB:

<img src="./images/config_folder.png" alt="Config Folder" width="300" height="auto">

1. Import MongoClient:
```javascript 
import { MongoClient } from 'mongodb';
```
2. Define Connection URL:
```javascript
const url = 'mongodb://localhost:27017/mydb';
```
- localhost:27017: The hostname and port number of the MongoDB server.
mydb : The name of the specific database you want to connect to.
3. Connection to MongoDB:
- Use the connect method of the MongoClient instance to establish a
connection to the MongoDB server
```javascript
import {MongoClient} from 'mongodb';

const url = "mongodb://localhost:27017/ecomDB";

const connectToMongoDB = () =>{
    MongoClient.connect(url)
    .then(client=>{
        console.log("MongoDB is connected")
    })
    .catch(err=>{
        console.log(err);
    })
}

export default connectToMongoDB;
```
- We have used .connect( ) method of MongoClient that returns a promise and
then we have exported the connecToMongoDB function.

4. Import the above function in server.js
```javascript
import express from "express";
import connectToMongoDB from "./config/mongodb.js";

const server = express();

// 8. Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`); // Log server start
  connectToMongoDB();
});
```

### Troubleshooting MongoDB Connection Issues with 'localhost'
If you're experiencing problems connecting to your MongoDB database using the
following connection string:
```javascript 
const url = "mongodb://localhost:27017/ecomDB";
```
It's worth noting that this error will not be faced if your PC uses IPv6. However, if
your PC is using IPv4 and the alias name "localhost" isn't assigned to the address
"127.0.0.1".

To resolve this issue, consider directly specifying the address in the connection string
like this:
```javascript
const url = "mongodb://127.0.0.1:27017/ecomDB";
```
This adjustment can help ensure a smoother connection experience.

## User Operations with MongoDB

### 1. Updated 'mongodb.js' file
#### Before Changes:
```javascript
import {MongoClient} from 'mongodb';
const url = "mongodb://localhost:27017/ecomDB";
const connectToMongoDB = () =>{
    MongoClient.connect(url)
    .then(client=>{
        console.log("MongoDB is connected")
    })
    .catch(err=>{
        console.log(err);
    })
}
export default connectToMongoDB;
```
#### After Changes:
```javascript
import { MongoClient } from "mongodb";
const url = "mongodb://localhost:27017/ecomDB";

let client;
export const connectToMongoDB = () => {
  MongoClient.connect(url)
    .then((clientInstance) => {
      client = clientInstance;
      console.log("MongoDB is connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDB = () => {
  return client.db();
};
```
- Added let client;: Stores the MongoDB client instance for reuse.
- Updated .then() callback: Assigns clientInstance to client before logging the connection message.
- Introduced getDB() function: Returns the database instance using client.db(), enabling access to the database elsewhere in the code.

### 2. Updated 'user.model.js' file
#### Before Changes:
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
  // More code...
}
```
#### After Changes:
```javascript
import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export class UserModel {
  constructor(name, email, password, type) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }

  static async signUp(name, email, password, type) {
    try {
      const db = getDB(); // 1. Get the database
      const collection = db.collection("users");  // 2. Get the collection
      const newUser = new UserModel(name, email, password, type);
      await collection.insertOne(newUser);  // 3.Insert the document
      return newUser;
    } catch (err) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }
  // More code...
}
```
- Removed id from the constructor: MongoDB automatically generates _id.
- Made signUp() asynchronous: Added async to handle database operations properly.
- Removed manual ID generation: MongoDB automatically assigns a unique _id.
- Replaced in-memory array with MongoDB: Instead of storing users in a local array, it now fetches the database using getDB() and accesses the "users" collection.
- Stored user in MongoDB: Used collection.insertOne(newUser) to save the user persistently.
- Added error handling: Wrapped the code in a try-catch block to catch database errors and return a meaningful ApplicationError.

### 3. Updated 'user.controller.js' file
#### Before Changes:
```javascript
 signUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = UserModel.signUp(name, email, password, type);
    res.status(201).send(user);
}
```

#### After Changes:
```javascript
async signUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = await UserModel.signUp(name, email, password, type);
    res.status(201).send(user);
}
```
- Made signUp() asynchronous: Added await to handle the async database operation properly.
- Ensured proper user creation: Now waits for UserModel.signUp() to complete before sending a response.


### 4. Updated in 'server.js' file
#### Before Changes:
```javascript
import connectToMongoDB from "./config/mongodb.js";
```
#### After Changes:
```javascript
import {connectToMongoDB} from "./config/mongodb.js";
```
Changed from default import to named import because connectToMongoDB is now exported using export const instead of export default

### 5. Testing in Postman 
<img src="./images/userOperation_mongoDB_postman.png" alt="User Operation with MongoDB in Postman" width="600" height="auto">

<img src="./images/userOperation_mongoDBCompass.png" alt="User Operation in MongoDB Compass" width="600" height="auto">

## Repository Pattern
<img src="./images/repository_pattern.png" alt="Repository Pattern" width="550" height="auto">

The repository pattern is a software design concept that promotes the separation of
concerns and enhances the maintainability and scalability of applications by
providing an organised approach to interact with data sources, such as databases

### Benefits of Repository Pattern
1. Abstraction: It abstracts data source details, providing a consistent interface
for data operations across diverse storage mechanisms.
2. Modularity: Repositories encapsulate data logic, enabling modular and
reusable code components.
3. Maintenance: Changes to data source or structure are localised within
repositories, simplifying maintenance efforts.
4. Testing: Repositories facilitate isolated unit testing by allowing mock
implementations.
5. Caching: Data caching can be implemented within repositories for improved
performance.
6. Query Logic: Complex queries and filtering logic are centralised in
repositories.
7. Database Agnosticism: The pattern enables flexibility in switching between
different data sources.
8. Security: Repositories can enhance security through parameterised queries
and validation.

### The Use Case of the Repository Pattern
Scenario: Online Bookstore Management System
Explanation:
In this example, we'll use the mongodb package to interact with MongoDB. The
repository pattern will help us separate the data access logic from the business logic.

#### MongoDB Connection:
```javascript
//databaseConnection.js
import { MongoClient } from "mongodb";
const url = "mongodb://localhost:27017";
const dbName = "bookstore";

let client;
async function connect() {
  client = new MongoClient(url);
  await client.connect();
  console.log("Connected to MongoDB");
}

function getDatabase() {
  return client.db(dbName);
}

export { connect, getDatabase };
```

#### Book Repository:
```javascript
import { ObjectId } from 'mongodb';
import { getDatabase } from './databaseConnection';

class BookRepository {
    async getAll() {
        const db = getDatabase();
        return await db.collection('books').find().toArray();
    }

    async getById(bookId) {
        const db = getDatabase();
        return await db.collection('books').findOne({ _id: ObjectId(bookId) });
    }

    async create(bookData) {
        const db = getDatabase();
        const result = await db.collection('books').insertOne(bookData);
        return result.ops[0];
    }

    async update(bookId, bookData) {
        const db = getDatabase();
        return await db.collection('books').findOneAndUpdate(
            { _id: ObjectId(bookId) },
            { $set: bookData },
            { returnDocument: "after" } 
            /*
            ❌ { returnOriginal: false } is deprecated in MongoDB 4+.
            ✅ Fix: Use { returnDocument: "after" } instead:
            */
        );
    }
    
    async delete(bookId) {
        const db = getDatabase();
        await db.collection('books').deleteOne({ _id: ObjectID(bookId)});
    }
}

export default BookRepository;
```

#### Usage:
Here's what we're going to do:
1. Connect to the Database: We'll start by establishing a connection to the MongoDB
database using the connect function.
2. Create Books: We'll utilise the BookRepository to create two book entries: "The
Great Gatsby" by F. Scott Fitzgerald and "To Kill a Mockingbird" by Harper Lee.
3. Retrieve All Books: We'll fetch and display all the books stored in the collection
using the getAll method.
4. Update a Book Title: We'll demonstrate updating a book's title using the update
method after fetching it by its ID.
5. Delete a Book: We'll delete one of the books from the collection using the delete
method.

```javascript
import { connect } from './databaseConnection';
import BookRepository from './bookRepository';

(async () => {
    try {
        await connect();
        const bookRepo = new BookRepository();

        // Create books
        const book1 = await bookRepo.create({
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
        });

        const book2 = await bookRepo.create({
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
        });

        console.log('Books created:', book1, book2);

        // Fetch all books
        const allBooks = await bookRepo.getAll();
        console.log('All books:', allBooks);

        // Update a book
        const bookToUpdate = await bookRepo.getById(book1._id);
        if (bookToUpdate) {
            bookToUpdate.title = 'Updated Title';
            const updatedBook = await bookRepo.update(bookToUpdate._id, bookToUpdate);
            console.log('Updated book:', updatedBook);
        }

        // Delete a book
        await bookRepo.delete(book2._id);
        console.log('Book deleted:', book2._id);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (client) {
            client.close();
            console.log('Disconnected from MongoDB');
        }
    }
})();
```
In this example, we're using the mongodb package to interact directly with
MongoDB. The databaseConnection.js file handles the database connection, and the
BookRepository class encapsulates the data access logic. This implementation
adheres to the repository pattern and separates data access from business logic.


## User Repository 
### 1. Create 'user.repository.js' file
```javascript
import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class UserRepository {
  constructor() {
    this.collection = "users";
  }
  async signUp(newUser) {
    try {
      const db = getDB(); // 1. Get the database
      const collection = db.collection(this.collection); // 2. Get the collection
      await collection.insertOne(newUser); // 3.Insert the document
      return newUser;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }

 async signIn(email, password) {
    try {
      const db = getDB(); // 1. Get the database
      const collection = db.collection(this.collection); // 2. Get the collection
      return await collection.findOne({ email, password }); // 3. Find the document
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }
}

export default UserRepository;
```

The UserRepository class handles user authentication operations using MongoDB.
1. signUp(newUser)
    - Connects to the database (getDB()).
    - Inserts the newUser object into the "users" collection.
    - Returns the newly created user.
    - If an error occurs, it throws an ApplicationError with a 500 status code.
2. signIn(email, password)
    - Connects to the database (getDB()).
    - Searches for a user with the given email and password in the "users" collection.
    - Returns the user object if found, otherwise returns null.
    - If an error occurs, it throws an ApplicationError with a 500 status code.

### 2. Updated 'user.model.js' file

#### Before Changes:
```javascript
import { getDB } from "../../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export class UserModel {
  constructor(name, email, password, type) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }

  static async signUp(name, email, password, type) {
    try {
      const db = getDB(); // 1. Get the database
      const collection = db.collection("users");  // 2. Get the collection
      const newUser = new UserModel(name, email, password, type);
      await collection.insertOne(newUser);  // 3.Insert the document
      return newUser;
    } catch (err) {
      throw new ApplicationError("Something went wrong", 503);
    }
  }

  static signIn(email, password) {
    const user = users.find((u) => u.email == email && u.password == password);
    return user;
  }

  static getAll() {
    return users;
  }
}
```

#### After Changes:
```javascript
export class UserModel {
  constructor(name, email, password, type) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }
}
```
#### Key Changes
1. Removed signUp and signIn Methods from UserModel:
    - Previously, UserModel had a signUp method that interacted with the database (MongoDB).
    - The signIn method was also present in UserModel, which searched for a user in a static array.
    - In the updated code, both methods have been removed from UserModel.

2. UserModel Now Only Contains the Constructor:
    - The updated version defines only the user schema (constructor) without any methods.
    - It no longer interacts with the database, making it a pure data model.


3. Removed getAll Method:
    - The getAll method, which retrieved static user data, has been removed.
    - Now, all user-related queries are likely handled in UserRepository.

#### Why These Changes?
1. ✔ Separation of Concerns – Now, database interaction is handled separately (possibly in UserRepository).
2. ✔ Cleaner Model – UserModel now only represents a user object rather than handling database operations.
3. ✔ More Scalable – The updated design allows flexibility in managing user-related operations separately.

### 3. Updated 'user.controller.js' file

#### Before Change:
```javascript
import { UserModel } from "./user.model.js";
import jwt from "jsonwebtoken";

export default class UserController {
  async signUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = await UserModel.signUp(name, email, password, type);
    res.status(201).send(user);
  }

  signIn(req, res) {
    const result = UserModel.signIn(req.body.email, req.body.password);
    if (!result) {
      return res.status(400).send("Invalid Credentials !");
    } else {
      //1. Create token
      const token = jwt.sign(
        { userID: result.id, email: result.email },
        "N6BUpqT7VL8cI7VbzLHaaS9txwGJWZMR",
        {
          expiresIn: "1h",
        }
      );
      //2. Send token.
      return res.status(200).send(token);
      //return res.send("Login Successful !");
    }
  }
}
```

After Changes:
```javascript
import { UserModel } from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = new UserModel(name, email, password, type);
    await this.userRepository.signUp(user);
    res.status(201).send(user);
  }

  async signIn(req, res, next) {
    try {
      const result = await this.userRepository.signIn(
        req.body.email,
        req.body.password
      );
      if (!result) {
        return res.status(400).send("Invalid Credentials !");
      } else {
        //1. Create token
        const token = jwt.sign(
          { userID: result.id, email: result.email }, // Payload data
          "N6BUpqT7VL8cI7VbzLHaaS9txwGJWZMR", // Secret key for signing
          {
            expiresIn: "1h", // Token expiry set to 1 hour
          }
        );
        //2. Send token.
        return res.status(200).send(token);
        //return res.send("Login Successful !");
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
```
#### Key Changes
1. Introduced UserRepository for Database Interaction:
    - Instead of directly using UserModel, the controller now interacts with UserRepository for user-related database operations.
    - A userRepository instance is created in the constructor.

2. Updated signUp Method:
    - Previously, UserModel.signUp() was called directly.
    - Now, a new instance of UserModel is created and passed to this.userRepository.signUp(user).

3. Modified signIn Method:
    - Previously, UserModel.signIn() was used for authentication.
    - Now, it awaits this.userRepository.signIn(email, password), making the function asynchronous.
    - Added a try-catch block for better error handling, returning "Something went wrong" if an error occurs.

### 4. Update 'user.routes.js' file
#### Before Changes:
```javascript
userRouter.post("/signup", userController.signUp); // User registration  
userRouter.post("/signin", userController.signIn); // User login  
```
Here, userController.signUp and userController.signIn are passed directly as route handlers. However, this can cause issues with the this keyword inside class methods.

#### Problem with Direct Method Reference
  - When we pass userController.signUp directly, the function loses the context of the class (this binding).
  - Inside signUp(), this.userRepository might become undefined because the method is not executed in the correct context of UserController.

#### After Changes:
```javascript
userRouter.post("/signup", (req, res) => {
  userController.signUp(req, res);
}); // User registration
userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res); 
}); // User login
```
By wrapping the method inside an arrow function:
- This preserves the context of this, ensuring that this.userRepository remains accessible inside signUp() and signIn().
- Now, the functions execute correctly without losing their class context.

#### Key Takeaways
1. ✔ Prevents loss of this context inside class methods.
2. ✔ Ensures that userController methods work properly.
3. ✔ Better flexibility for adding extra logic in the future (e.g., logging, validation, error handling).

## Hashing Passwords
- Hashing passwords is a crucial practice in security to protect sensitive user
credentials.
- It involves converting plain-text passwords into irreversible and unique strings
of characters using cryptographic algorithms.
- This transformation ensures that attackers cannot easily decipher the original
passwords even if a database breach occurs.
### Working with bcrypt
1. Bcrypt is a widely used password-hashing algorithm that enhances security by
transforming passwords into irreversible hash values.
2. Bcrypt is favoured for its key features: salting and multiple rounds of hashing.
Salting involves adding a random value (salt) to each password before
hashing, preventing attackers from using precomputed hash tables (rainbow
tables) to crack passwords.
3. To install it, run the command: `npm i bcrypt`

### Basic usage
- After installing it, we have to import it
```javascript
import bcrypt from 'bcrypt';
```
- The hashPassword function asynchronously generates a secure hash from a
plain-text password and returns the hash. It utilises the bcrypt.genSalt and
bcrypt.hash functions.
```javascript
async function hashPassword(plainPassword) {
  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
}
```
The greater the amount of salt, the more intricate the complexity becomes, so
it should be kept at a minimum.

- Now we can compare two passwords using .compare method.
```javascript
async function authenticateUser(plainPassword, storedHash) {
  const passwordsMatch = await bcrypt.compare(plainPassword, storedHash);
  return passwordsMatch; // Returns true if passwords match
}
```

## Hashing User's Password 
### 1. Updated 'user.repository.js' file
#### Before Change:
```javascript
async signIn(email, password) {
    try {
      const db = getDB(); // 1. Get the database
      const collection = db.collection("users"); // 2. Get the collection
      return await collection.findOne({ email, password }); // 3. Find the document
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }
```

#### After Change:
```javascript
 async findByEmail(email) {
    try {
      const db = getDB(); // 1. Get the database
      const collection = db.collection("users"); // 2. Get the collection
      return await collection.findOne({ email }); // 3. Find the document
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }
```
Changes in the Code:
1. Removed signIn(email, password) method:
    - Previously, this method searched for a user based on both email and password.
    - This approach is not secure because it directly queries the database with the password, which should ideally be hashed and verified separately.
2. Added findByEmail(email) method:
    - This method now searches for a user only by email, without checking the password.
    - It allows for a more secure authentication flow, where password validation can be handled separately (e.g., using bcrypt for hashing and comparison).
    - This change improves security and aligns with best practices in authentication.

### 2. Updated 'user.controller.js' file
#### Before Changes:
```javascript
async signUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = new UserModel(name, email, password, type);
    await this.userRepository.signUp(user);
    res.status(201).send(user);
  }

  async signIn(req, res, next) {
    try {
      const result = await this.userRepository.signIn(
        req.body.email,
        req.body.password
      );
      if (!result) {
        return res.status(400).send("Invalid Credentials !");
      } else {
        //1. Create token
        const token = jwt.sign(
          { userID: result.id, email: result.email }, // Payload data
          "N6BUpqT7VL8cI7VbzLHaaS9txwGJWZMR", // Secret key for signing
          {
            expiresIn: "1h", // Token expiry set to 1 hour
          }
        );
        //2. Send token.
        return res.status(200).send(token);
        //return res.send("Login Successful !");
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
```

#### After Changes:
```javascript
 async signUp(req, res) {
    const { name, email, password, type } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new UserModel(name, email, hashedPassword, type);
    await this.userRepository.signUp(user);
    res.status(201).send(user);
  }

  async signIn(req, res, next) {
    try {
      // 1. Find user by email
      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Invalid Credentials !");
      } else {
        // 2. Compare password with hashed password
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          // 3. Create token
          const token = jwt.sign(
            { userID: user._id, email: user.email }, // Payload data
            "N6BUpqT7VL8cI7VbzLHaaS9txwGJWZMR", // Secret key for signing
            {
              expiresIn: "1h", // Token expiry set to 1 hour
            }
          );
          // 4. Send token.
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Invalid Credentials !");
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
```

1. Password Hashing in signUp Method:
    - Previously, passwords were stored in plain text, making them vulnerable if the database was compromised.
    - Now, bcrypt.hash(password, 12) is used to encrypt the password before storing it in the database.The number 12 represents the salt rounds, adding randomness to the hash for stronger security.
    - Now, passwords are securely hashed using bcrypt before storing them, adding an extra layer of protection
2. Secure Password Verification in signIn Method:
    - Instead of querying both email and password directly, the system first retrieves the user by email.
    - Then, bcrypt.compare(req.body.password, user.password) is used to check if the entered password matches the stored hashed password.
    - If the comparison returns true, authentication proceeds; otherwise, it is rejected.
    - After successful authentication, a JWT token is generated using jwt.sign(), where user._id (instead of result.id) is used as MongoDB stores the unique identifier as _id. Previously, result came from this.userRepository.signIn(), which checked both email and password together. Now, the process is split: first, fetch the user by email (user), then verify the password. Since result is no longer used, we correctly reference user._id to ensure the JWT contains the right user ID, preventing authentication errors.

#### Why These Changes?
1. bcrypt.hash() for Secure Storage:
    - Encrypts passwords before saving them, preventing exposure in case of a database breach.
    - Uses salting to ensure even identical passwords have unique hashes.
2. bcrypt.compare() for Safe Authentication:
    - Compares the entered password with the hashed one without exposing raw credentials.
    - Prevents direct password queries, reducing security risks.
#### Security Benefits:
1. ✅ Protects user data from breaches.
2. ✅ Prevents credential leaks and brute-force attacks.

### 3. Testing in Postman

#### User SignUp
<img src="./images/hashedPassword_Postman.png" alt="User SignUp Hashed Password" width="650" height="auto">
<img src="./images/hashedPassword_mongoDBCompass.png" alt="User SignUp Hashed Password" width="650" height="auto">

#### User SignIn
<img src="./images/userSignIn_afterHashedPassword1.png" alt="User SignIn Hashed Password" width="650" height="auto">
<img src="./images/userSignIn_afterHashedPassword2.png" alt="User SignIn Hashed Password" width="650" height="auto">


## Understanding dotenv
 1. dotenv is a popular npm package that simplifies the management of
 environment variables in Node.js applications.
 2. It enables developers to store sensitive configuration information, API keys,
 and other settings in a .env file, separate from the source code.
 3. dotenv loads the variables from the .env file into the environment, making
 them accessible via the process.env object.
 
 ### Reasons for using dotenv
 1. Security: Sensitive data is kept outside of the source code, reducing the risk
 of accidental exposure.
 2. Readability: The separation of configuration data from code improves the
 clarity and maintainability of the application.
 3. Ease of Use: dotenv simplifies the process of loading environment variables,
 requiring only a single line of code.
 4. Portability: Developers can easily share the same codebase across different
 environments without changing the source code.
 5. Configuration: dotenv enhances the configuration process by providing a
 standardised method to handle environment-specific variables.
 
 ### Using dotenv to Safely Configure MongoDB URL and JWT SecretKey
 1. Install it using the command: `npm i dotenv`
 2. Create '.env' file in root directory of the app:
 
    <img src="./images/env_gitignore.png" alt="'.env' in '.gitignore'" width="300" height="auto">
    
    Ensure your .gitignore file includes it to prevent sensitive information and
    configuration data from being accidentally pushed to version control systems like Git.
 
 3. Save the important URLs or keys of passwords in the .env file:
    ```env
    DB_URL = mongodb://localhost:27017/ecommerceDB
    JWT_SECRET = N6BUpqT7VL8cI7VbzLHaaS9txwGJWZMR
    ```
 4. Import dotenv wherever needed and call the .config() method to load environment variables. Here, a separate file env.js is created:
    ```javascript
    import dotenv from "dotenv";
    dotenv.config(); // Load all the environment variables in application
    ```

 5. Import env.js at the top of server.js to ensure environment variables are available throughout the application:
    ```javascript
    import "./env.js";
    import express from "express";
    ```

 5. Using an Environment Variable (process.env.DB_URL) in 'mongodb.js':
    - In the first version, the MongoDB connection URL is hardcoded as:
    ```javascript
    const url = "mongodb://localhost:27017/ecommerceDB";
    ```
    - In the updated version, the connection URL is fetched from an environment variable:     This makes the code more secure and configurable without modifying the source code.
    ```javascript
    const url = process.env.DB_URL;
    ```
    #### Benefits: Flexibility & Security
    1. Using process.env.DB_URL allows different environments (development, production) to use different databases without changing the code.    
    2. Hardcoding credentials is not recommended, as it can expose sensitive information.
6. Using an Environment Variable (process.env.JWT_SECRET) in 'user.controller.js':
    #### Before:
    ```javascript
    jwt.sign(
      { userID: result.id, email: result.email },
      "N6BUpqT7VL8cI7VbzLHaaS9txwGJWZMR", // Hardcoded secret key
      { expiresIn: "1h" }
    );
    ```
    #### After:
    ```javascript
    jwt.sign(
      { userID: result.id, email: result.email },
      process.env.JWT_SECRET, // Using environment variable
      { expiresIn: "1h" }
    );
    ```
    #### Why this change?
    1. ✅ Security: Avoids exposing the secret key in code.
    2. ✅ Flexibility: Allows different environments (dev, production) to use different secrets.
    3. ✅ Best Practice: Credentials should be stored in environment variables, not hardcoded.

## Secure Car Dealership Management with Repository Pattern in Node.js
In this concise guide, we'll build a secure car dealership management system using
Node.js, the Repository Pattern, the bcrypt library for password security, and the
dotenv library for environment variables. Our scenario involves a car dealership
managing its inventory and sales.
#### Scenario:
You are developing a car dealership management system for "Speedy Motors." The
system should securely store user credentials, manage car inventory, and track
sales.

### 1. User Authentication:

#### Step 1: Repository Setup -> In 'user.repository.js'
```javascript
import { getDB } from '../config/mongodb.js';
import bcrypt from 'bcrypt';
import { ApplicationError } from '../../error-handler/applicationError.js';

class UserRepository {
    async signUp(newUser) {
        try {
            const db = await getDB();
            const collection = db.collection("users");
            
            // Hash the password before storing
            const hashedPassword = await bcrypt.hash(newUser.password, 10);
            newUser.password = hashedPassword;
            
            // Insert user into the collection
            await collection.insertOne(newUser);
        } catch (err) {
            throw new ApplicationError("Database Error", 500);
        }
    }

    async signIn(email, password) {
        try {
            const db = await getDB();
            const collection = db.collection("users");
            
            const user = await collection.findOne({ email });
            
            if (user && await bcrypt.compare(password, user.password)) {
                return user;
            } else {
                return null;
            }
        } catch (err) {
            throw new ApplicationError("Database Error", 500);
        }
    }
}

export default UserRepository;
```

#### Step 2: Controller and Routes -> In 'user.controller.js'
```javascript
import UserRepository from './user.repository.js';

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async signUp(req, res) {
        try {
            const { name, email, password, role } = req.body;
            const user = { name, email, password, role };
            
            const createdUser = await this.userRepository.signUp(user);
            res.status(201).send({ message: "User registered", user: createdUser });
        } catch (error) {
            res.status(500).send({ message: "Error registering user", error: error.message });
        }
    }

    async signIn(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userRepository.signIn(email, password);
            
            if (user) {
                res.status(200).send({ message: "Sign in successful", user });
            } else {
                res.status(401).send({ message: "Invalid credentials" });
            }
        } catch (error) {
            res.status(500).send({ message: "Error signing in", error: error.message });
        }
    }
}
```

### 2. Car Inventory Management:
#### Step 1: Repository Setup -> In 'car.repository.js'
```javascript
import { getDB } from '../../config/mongodb.js';
import { ApplicationError } from "../../error-handler/applicationError.js";

class CarRepository {
    async add(newCar) {
        try {
            const db = await getDB();
            const collection = db.collection("cars");
            
            await collection.insertOne(newCar);
            return newCar;
        } catch (err) {
            throw new ApplicationError("Database Error", 500);
        }
    }

    async getAll() {
        try {
            const db = await getDB();
            const collection = db.collection("cars");
            
            const cars = await collection.find().toArray();
            return cars;
        } catch (err) {
            throw new ApplicationError("Database Error", 500);
        }
    }
    // Other methods for updating, filtering, and more...
}

export default CarRepository;
```

#### Step 2: Controller and Routes -> In 'car.controller.js'
```javascript
import CarRepository from './car.repository.js';

export default class CarController {
    constructor() {
        this.carRepository = new CarRepository();
    }

    async addCar(req, res) {
        try {
            const { make, model, year, price } = req.body;
            const newCar = { make, model, year, price };
            
            const createdCar = await this.carRepository.add(newCar);
            res.status(201).send({ message: "Car added", car: createdCar });
        } catch (error) {
            res.status(500).send({ message: "Error adding car", error: error.message });
        }
    }

    async getAllCars(req, res) {
        try {
            const cars = await this.carRepository.getAll();
            res.status(200).send(cars);
        } catch (error) {
            res.status(500).send({ message: "Error retrieving cars", error: error.message });
        }
    }
    // Other methods for managing car inventory...
}
```

### 3. Environment Variables with dotenv:
#### 1. Create a .env file:
```env
DB_CONNECTION_STRING=mongodb://localhost:27017/mydb
SECRET_KEY=mysecretkey
```

#### 2. In config/mongodb.js:
```javascript
import dotenv from 'dotenv';
dotenv.config();
// Use process.env.DB_CONNECTION_STRING in your code
```

### Conclusion:
By implementing the Repository Pattern, secure user authentication using bcrypt,
and utilizing environment variables with dotenv, we've built a robust car dealership
management system. This scenario-based approach covers user registration,
authentication, car inventory, and sales tracking. The approach ensures data
security, integrity, and scalability in your application