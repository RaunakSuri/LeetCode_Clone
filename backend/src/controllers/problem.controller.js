import { submitBatch, submitToken } from "../utils/problem.util.js";
import { Problem } from "../models/problem.model.js";

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

export { createProblem };
