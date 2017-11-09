'use strict';

const rp = require('request-promise');

const ENDPOINT = 'http://api.pearson.com/v2/dictionaries/entries?headword=';
const wordData = require('./data/words');

class DictionaryDataHelper {
  constructor() {
    this.word = null;
  }

  static requestDefinition(word) {
    return this.getDefinition(word)
    .then( res => {
      return res;
    })
  }

  static getRandomWord(gradeLevel) {
    // Checking for user or Alexa bad input, or no input
    if (!gradeLevel) gradeLevel = '2' // TODO: randomize later?
    let key = 'grade' + gradeLevel[0]; // Disregard end of 1st, 2nd, 3rd, etc.
    let randomIndex = Math.floor(Math.random() * (wordData[key].length));
    let word = wordData[key][randomIndex];
    return word;
  }

  static getDefinition(word) {
    const options = {
      method: 'GET',
      uri: ENDPOINT + word,
      // resolveWIthFullResponse: true,
      json: true
    };
    return rp(options);
  }

  static formatDefinition(wordInfo) {
    return `The definition for the word, ${wordInfo.word}, is: "${wordInfo.definition}."`;
  }

}

module.exports = DictionaryDataHelper;
