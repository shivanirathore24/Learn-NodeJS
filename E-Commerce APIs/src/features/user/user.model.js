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

let users = [
  {
    id: 1,
    name: "Seller User",
    email: "seller@ecom.com",
    password: "password1",
    type: "seller",
  },
  {
    id: 2,
    name: "Customer1 User",
    email: "customer1@ecom.com",
    password: "customer1",
    type: "customer",
  },
  {
    id: 3,
    name: "Customer2 User",
    email: "customer2@ecom.com",
    password: "customer2",
    type: "customer",
  },
];
