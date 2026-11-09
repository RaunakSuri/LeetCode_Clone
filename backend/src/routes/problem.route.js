import express from "express";
import { validateAdmin } from "../middlewares/validateAdmin.middleware.js";
import { validateUser } from "../middlewares/validateUser.middleware.js";
import {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblem,
  getAllProblems,
  getSolvedProblems,
  submittedSolutions,
} from "../controllers/problem.controller.js";

const problemRouter = express.Router();

// These routes can only be accessed by admin
problemRouter.post("/createProblem", validateAdmin, createProblem);
problemRouter.patch("/update/:id", validateAdmin, updateProblem);
problemRouter.delete("/delete/:id", validateAdmin, deleteProblem);

// // These routes can be accessed by any user
problemRouter.get("/getProblem/:id", validateUser, getProblem);
problemRouter.get("/getAllProblems", validateUser, getAllProblems);
problemRouter.get("/solved", validateUser, getSolvedProblems);
problemRouter.get("/submittedSolutions", validateUser, submittedSolutions);

export { problemRouter };
