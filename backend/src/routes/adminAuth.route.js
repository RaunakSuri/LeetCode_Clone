import express from "express";
import {
  register,
  login,
  logout,
} from "../controllers/adminAuth.controller.js";
import { validateAdmin } from "../middlewares/validateAdmin.middleware.js";
const adminAuthRouter = express.Router();

adminAuthRouter.post("/register", register);
adminAuthRouter.post("/login", login);
adminAuthRouter.post("/logout", validateAdmin, logout);

export { adminAuthRouter };
