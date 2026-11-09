import { submitBatch, submitToken } from "../utils/problem.util.js";
import { Problem } from "../models/problem.model.js";
import { Submissions } from "../models/submission.model.js";
import { User } from "../models/user.model.js";

const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator,
    } = req.body;

    const languageArr = {
      "c++": 54,
      java: 62,
      python: 71,
      javascript: 63,
    };

    for (const { language, completeCode } of referenceSolution) {
      // Source Code  |  Language Id  |  STDIN  |  Expected Output
      const languageId = languageArr[language.toLowerCase()];

      const submissions = visibleTestCases.map((testCase, index) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
      }));

      const submitResult = await submitBatch(submissions);
      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);
      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("Error While Executing");
        }
      }
    }

    // Now we can store the problem in DB

    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });
    res.status(201).send("Problem Saved Successfully");
  } catch (error) {
    res.status(401).send(`Error Encountered ${error}`);
  }
};

const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("Problem ID Not Defined");
    }
    const DsaProblem = await Problem.findById(id);
    if (!DsaProblem) {
      return res.status(404).send("Problem Does Not Exist");
    }
    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator,
    } = req.body;

    const languageArr = {
      "c++": 54,
      java: 62,
      python: 71,
      javascript: 63,
    };

    for (const { language, completeCode } of referenceSolution) {
      // Source Code  |  Language Id  |  STDIN  |  Expected Output
      const languageId = languageArr[language.toLowerCase()];

      const submissions = visibleTestCases.map((testCase, index) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
      }));

      const submitResult = await submitBatch(submissions);
      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);
      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("Error While Executing");
        }
      }
    }

    // Now we can update the problem in DB
    const userProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true },
    );
    res.status(201).send("Problem Updated Successfully");
  } catch (error) {
    res.status(500).send(`Error Encountered : ${error}`);
  }
};

const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send("Problem ID Not Defined");
    }
    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deleteProblem) {
      return res.status(404).send("Problem Does Not Exist");
    }
    res.status(200).send("Problem Deleted Successfully");
  } catch (error) {
    res.status(404).send(`Error Encountered : ${error}`);
  }
};

const getProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send("Problem ID Not Defined");
    }
    const getProblem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases startCode referenceSolution",
    );
    if (!getProblem) {
      return res.status(404).send("Problem Does Not Exist");
    }
    return res.status(200).send(getProblem);
  } catch (error) {
    res.status(500).send(`Error Encountered : ${error}`);
  }
};

const getAllProblems = async (req, res) => {
  try {
    const getProblem = await Problem.find({}).select(
      "_id title difficulty tags",
    );
    if (getProblem.length === 0) {
      return res.status(404).send("Problems Do Not Exist");
    }
    return res.status(200).send(getProblem);
  } catch (error) {
    res.status(500).send(`Error Encountered : ${error}`);
  }
};

const getSolvedProblems = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).populate({
      path: "problemsSolved",
      select: "_id title difficulty tags",
    });
    res.status(200).send(user.problemsSolved);
  } catch (error) {
    res.status(500).send(`Error Encountered : ${error}`);
  }
};

const submittedSolutions = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;

    const ans = await Submissions.find({ userId, problemId });
    if (ans.length == 0) {
      res
        .status(200)
        .send("User has not made any submissions for this problem");
    }
    res.status(200).send(ans);
  } catch (error) {
    res.status(500).send(`Error Encountered : ${error}`);
  }
};

export {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblem,
  getAllProblems,
  getSolvedProblems,
  submittedSolutions,
};
