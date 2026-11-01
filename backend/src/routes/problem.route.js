import express from "express";

const problemRouter = express.Router();

// These routes can only be accessed by admin
problemRouter.post("/createProblem", createProblem);
problemRouter.patch("/:id", updateProblem);
problemRouter.delete("/:id", deleteProblem);

// These routes can be accessed by any user
problemRouter.get("/:id", getProblem);
problemRouter.get("/", getAllProblems);
problemRouter.get("/solved", getSolvedProblems);

export { problemRouter };
