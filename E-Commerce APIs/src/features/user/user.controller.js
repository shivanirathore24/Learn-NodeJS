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
