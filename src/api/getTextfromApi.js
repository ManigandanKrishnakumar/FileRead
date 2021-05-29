const { default: axios } = require("axios");

const getTextFromApi = async (url) => {
  console.log("Downloading...");
  try {
    const response = await axios({
      url,
      method: "GET",
    });
    console.log("Download Complete !!");
    return response.data;
  } catch (error) {
    console.log(error);
    console.log("Something went wrong, Unable to get text file from the API");
  }
};

module.exports = {
  getTextFromApi,
};
