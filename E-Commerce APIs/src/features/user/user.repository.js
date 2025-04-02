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

  async findByEmail(email) {
    try {
      const db = getDB(); // 1. Get the database
      const collection = db.collection(this.collection); // 2. Get the collection
      return await collection.findOne({ email }); // 3. Find the document
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong", 500);
    }
  }
}

export default UserRepository;
