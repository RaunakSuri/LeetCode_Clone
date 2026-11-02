import axios from "axios";

const waiting = (timer) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timer);
  });
};

const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://api.onlinecompiler.io/api/judge0/submissions/batch",
    headers: {
      "X-Auth-Token": process.env.JUDGE0_API,
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  return await fetchData();
};

const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: "https://api.onlinecompiler.io/api/judge0/submissions/batch",
    params: {
      tokens: resultToken.join(","),
      fields: "token,stdout,stderr,compile_output,status_id,time,memory",
    },
    headers: {
      "X-Auth-Token": process.env.JUDGE0_API,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  while (true) {
    const result = await fetchData();
    const isResultObtained = result.submissions.every(
      (res) => res.status_id > 2,
    );
    if (isResultObtained) {
      return result.submissions;
    }

    await waiting(1000);
  }
};

export { submitBatch, submitToken };
