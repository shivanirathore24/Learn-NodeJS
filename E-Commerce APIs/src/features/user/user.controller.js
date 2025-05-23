import { UserModel } from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const userID = req.userID;
    try {
      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password is updated !");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password, type } = req.body;
      console.log("Password from request:", password);
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
      const isValid = passwordRegex.test(password);
      console.log("Is password valid?", isValid);

      if (!isValid) {
        return res
          .status(400)
          .send(
            "Password must be 8-12 characters with letter, number, special."
          );
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new UserModel(name, email, hashedPassword, type);
      // const user = new UserModel(name, email, password, type);
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    } catch (err) {
      next(err);
    }
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
            process.env.JWT_SECRET, // Secret key for signing
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
      return res.status(500).send("Something went wrong");
    }
  }
}
