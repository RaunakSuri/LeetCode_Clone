import express from "express";
import {
  register,
  login,
  logout,
  deleteProfile
} from "../controllers/adminAuth.controller.js";
import { validateAdmin } from "../middlewares/validateAdmin.middleware.js";
const adminAuthRouter = express.Router();

adminAuthRouter.post("/register", register);
adminAuthRouter.post("/login", login);
adminAuthRouter.post("/logout", validateAdmin, logout);
userAuthRouter.delete("/deleteProfile", validateAdmin, deleteProfile);

export { adminAuthRouter };
