import express from "express";
import { register, login, logout } from "../controllers/userAuth.controller.js";
import { validateUser } from "../middlewares/validateUser.middleware.js";

const userAuthRouter = express.Router();

// Register
userAuthRouter.post("/register", register);

// Login
userAuthRouter.post("/login", login);

// Logout
userAuthRouter.post("/logout", validateUser, logout);

// Delete Profile
userAuthRouter.delete("/deleteProfile", validateUser, deleteProfile);

// // GetProfile
// authRouter.post("/getProfile", getProfile);

export { userAuthRouter };
