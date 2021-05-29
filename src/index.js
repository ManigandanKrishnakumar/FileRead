const { getTextFromApi } = require("./api/getTextfromApi");
const { getWordDetails } = require("./api/getWordDetailsApi");
const { URLS } = require("./constants/appConstants");

/**
 * @typedef {Object} TextObject
 * @property {string} text - Text from the document.
 */

/**
 * @typedef {Object} WordDetails
 * @property {string} word - word.
 * @property {?string} pos - part of speech of the word.
 * @property {?string[]} syn -  Synonymns of the word.
 *
 */

/**
 * This function is responsible for generating the hashmap with calculation of each word's occurrances.
 * @param {TextObject} textObject - Text object which contains the text
 * @returns WordsCountMap - hashmap with word as key and no.of ocurrances as value
 */
const getWordCount = (textObject) => {
  const wordsArray = textObject.text.split(" ");
  const wordCountMap = {};
  wordsArray.forEach((word) => {
    const actualWord = word.replace(/(\n|,|"|\?|\*|'|=|\/)/g, "").toLowerCase();

    if (actualWord.length > 1) {
      wordCountMap[actualWord]
        ? wordCountMap[actualWord]++
        : (wordCountMap[actualWord] = 1);
    }
  });
  return wordCountMap;
};

/**
 * This is function is responsible for converting words map into sorted array of the words with respect no. of occurance
 * @param {object} wordsMap - Words Count object which has key as the word and count as no.of occurance
 * @returns Array<Array<word, number.of occurance>>
 */
const getSortedWords = (wordsMap) => {
  const wordsCountArray = [];

  for (const word in wordsMap) {
    wordsCountArray.push([word, wordsMap[word]]);
  }

  wordsCountArray.sort((first, second) => {
    if (first[1] === second[1]) {
      if (first[0] < second[0]) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return second[1] - first[1];
    }
  });
  return wordsCountArray;
};

/**
 * This function is responsible for returning top 'n' number of words that are repeated most in the text.
 *
 * @param {TextObject} textObject - TextObject which contains the text
 * @param {number} n - top 'n' number of the words that are repeated most
 * @returns {string[]} - Array of top 'n' words
 */
const getTopNWords = (textObject, n = 10) => {
  const wordsMap = getWordCount(textObject);
  const sortedWords = getSortedWords(wordsMap);
  const topNwords = [];
  for (let i = 0; i < n; i++) {
    const word = sortedWords[i][0];

    topNwords.push(word);
  }
  return topNwords;
};

/**
 * This method returns array of details of each word in the input array
 * @param {string[]} words - Words array
 * @returns {WordDetails[]} - Details of the top words
 */
const getWordsDetails = async (words) => {
  console.log("Loading details of top words...");
  const wordsDetails = [];
  for (let i = 0; i < words.length; i++) {
    const wordDetail = await getWordDetails(words[i]);
    wordsDetails.push(wordDetail);
  }
  return wordsDetails;
};

const main = (async () => {
  // because string is primary type while passing it function it will not be passed as reference hence created a custom object.
  const textObject = { text: "" };
  textObject.text = await getTextFromApi(URLS.TEXT_API);

  // you can pass second optional parameter i.e. number of top words you need by default it will be 10
  const topWords = getTopNWords(textObject);
  console.log("Top Repated Words", topWords);

  const topWordsDetails = await getWordsDetails(topWords);
  console.log("Top Repeated Words Details", topWordsDetails);
})();
