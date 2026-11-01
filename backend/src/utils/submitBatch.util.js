import axios from "axios";
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
    }
  }
  return await fetchData();
};

export { submitBatch };
