import { redisClient } from "../db/redis.js";
import { User } from "../models/user.model.js";
import { validate } from "../utils/validate.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    try {
        // First we would have to validate whether the user has sent details in the correct format or not.
        validate(req.body);
    
        const { firstName, emailId, password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = "user";
        const user = await User.create(req.body); // We would not have to check whether email is already registered because it is kept unique in user model
    
        const token = jwt.sign(
          { _id: user._id, emailId: emailId },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" },
        );
        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
        res.status(201).send("User Registered Successfully");
      } catch (error) {
        res.status(400).send(`Error In Registering The User: ${error}`);
      }
};

const login = async (req, res) => {};

const logout = async (req, res) => {};

export { register };
