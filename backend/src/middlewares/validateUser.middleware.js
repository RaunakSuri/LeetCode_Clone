import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { redisClient } from "../db/redis.js";
const validateUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token Does Not Exist");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = payload;

    if (!_id) {
      throw new Error("Invalid Token");
    }

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Does Not Exist");
    }

    // We would have to check the Redis blocklist to determine whether the token is blocked or not.

    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      throw new Error("Invalid Token");
    }
    req.result = result;
    next();
  } catch (error) {
    res.status(401).send("Invalid Token");
  }
};

export { validateUser };
