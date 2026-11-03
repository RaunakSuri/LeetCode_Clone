import express from "express";
import validateUser from "../middlewares/validateUser.middleware.js";
import { submitCode } from "../controllers/submission.controller.js";
const submissionRouter = express.Router();

submissionRouter.post("/submit/:id", validateUser, submitCode);