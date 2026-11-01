import express from "express";
import { validateAdmin } from "../middlewares/validateAdmin.middleware.js";
import { createProblem } from "../controllers/problem.controller.js";

const problemRouter = express.Router();

// These routes can only be accessed by admin
problemRouter.post("/createProblem", validateAdmin, createProblem);
// problemRouter.patch("/:id", validateAdmin, updateProblem);
// problemRouter.delete("/:id", validateAdmin, deleteProblem);

// // These routes can be accessed by any user
// problemRouter.get("/:id", getProblem);
// problemRouter.get("/", getAllProblems);
// problemRouter.get("/solved", getSolvedProblems);

export { problemRouter };
