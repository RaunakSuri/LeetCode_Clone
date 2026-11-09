import { redisClient } from "../db/redis.js";
import { User } from "../models/user.model.js";
import { Submission } from "../models/submission.model.js";
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

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId) {
      throw new Error("Please Enter an Email Id");
    }
    if (!password) {
      throw new Error("Please Enter Your Password");
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User Does Not Exist");
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign(
      { _id: user._id, emailId: emailId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(200).send("User Login Sucessful");
  } catch (error) {
    res.status(401).send(`Error Encountered: ${error}`);
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;

    const payload = jwt.decode(token);
    await redisClient.set(`token:${token}`, "Blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);

    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).send("User Logged Out Successfully");
  } catch (error) {
    res.status(503).send(`Error Encountered: ${error}`);
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;

    // Here we have deleted the user from DB
    await User.findByIdAndDelete(userId);

    // Now we need to delete the submissions made by the user
    // await Submission.deleteMany({ userId });     --> We are handling this directly in userSchema using post method.
    res.status(200).send("User Deleted Successfully");
  } catch (error) {
    res.status(500).send(`Error Encountered : ${error}`);
  }
};

export { register, login, logout, deleteProfile };
