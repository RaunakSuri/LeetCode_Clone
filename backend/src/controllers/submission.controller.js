import { Problem } from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";
import { submitBatch, submitToken } from "../utils/problem.util.js";

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;
    if (!userId || !problemId || !language) {
      return res.status(400).send("All Fields are Required");
    }

    // Fetch the problem from DB
    const problem = await Problem.findById(problemId);
    // Before sending the code to JudgeO we will store it in DB because incase some error happens then the code will not get lost.

    let submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      textCasesPassed: 0,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });

    // Now we will submit the code to JudgeO
    const languageArr = {
      "c++": 54,
      java: 62,
      python: 71,
      javascript: 63,
    };
    const languageId = languageArr[language.toLowerCase()];
    const submissions = problem.hiddenTestCases.map((testCase, index) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    // Now abb we have got the test results about how the code performed now we need to update the already created submittedResult to store the performance of the code

    let testCasesPassed = 0;
    let runTime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;
    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runTime += parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id == 4) {
          status = "error";
          errorMessage = test.stderr;
        } else {
          status = "wrong";
          errorMessage = test.stderr;
        }
      }
    }
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.status = status;
    submittedResult.runtime = runTime;
    submittedResult.memory = memory;
    await submittedResult.save();

    res.status(201).send(submittedResult);
  } catch (error) {
    res.status(500).send(`Error Encountered : ${error}`);
  }
};

export { submitCode };
