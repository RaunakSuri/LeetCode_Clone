import submitBatch from "../utils/submitBatch.util.js";
const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      visbleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator,
    } = req.body;

    const langaugeArr = {
      "c++": 54,
      java: 62,
      python: 71,
      javascript: 63,
    };

    for (const { langauge, completeCode } of referenceSolution) {
      // Source Code  |  Language Id  |  STDIN  |  Expected Output
      const languageId = langaugeArr[langauge.toLowerCase()];
    }

    const submissions = visbleTestCases.map((input, output) => ({
      source_code: completeCode,
      language_id: languageId,
      stdin: input,
      expected_output: output,
    }));

    const submitResult = await submitBatch(submissions);
  } catch (error) {
    res.status(401).send(`Error Encountered ${error}`);
  }
};

export { createProblem };
