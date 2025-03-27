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

const url = "mongodb://localhost:27017/ecomdb";

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
const url = "mongodb://localhost:27017/ecomdb";
```
It's worth noting that this error will not be faced if your PC uses IPv6. However, if
your PC is using IPv4 and the alias name "localhost" isn't assigned to the address
"127.0.0.1".

To resolve this issue, consider directly specifying the address in the connection string
like this:
```javascript
const url = "mongodb://127.0.0.1:27017/ecomdb";
```
This adjustment can help ensure a smoother connection experience.

## User Operations with MongoDB

### 1. Updated 'mongodb.js' file
#### Before Changes:
```javascript
import {MongoClient} from 'mongodb';
const url = "mongodb://localhost:27017/ecomdb";
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
const url = "mongodb://localhost:27017/ecomdb";

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





