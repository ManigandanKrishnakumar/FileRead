const { default: axios } = require("axios");
const { URLS } = require("../constants/appConstants");

const getWordDetails = async (word) => {
  console.log(" ----- ", word);
  const API_KEY = process.env.DIC_API_KEY;
  try {
    const response = await axios({
      url: URLS.DICTIONARY_URL,
      method: "GET",
      params: {
        key: API_KEY,
        lang: "en-en",
        text: word,
      },
    });
    return parseData(response.data, word);
  } catch (error) {
    console.log(
      "Something went wrong, could not get details of the word",
      word
    );
    console.log(error);
  }
};

const parseData = (wordData, word) => {
  const dictionaryEntry = wordData.def[0];
  if (dictionaryEntry) {
    const wordDetails = {
      word: dictionaryEntry.text,
      pos: dictionaryEntry.pos,
      syn: [],
    };

    dictionaryEntry.tr.forEach((tr) => {
      wordDetails.syn.push(tr.text);
    });

    return wordDetails;
  }

  return { word };
};

module.exports = {
  getWordDetails,
};
