'use strict';

const rp = require('request-promise');

const ENDPOINT = 'http://api.pearson.com/v2/dictionaries/entries?headword=';
const wordData = require('./words');

class DictionaryDataHelper {
  constructor() {
    this.word = '';
  }

  static requestDefinition(word) {
    return this.getDefinition(word)
    .then( res => {
      return res;
    })
  }

  static getRandomWord(gradeLevel) {
    // Checking for user or Alexa bad input, or no input
    if (!gradeLevel || typeof gradeLevel !== 'number' || gradeLevel > 8 || gradeLevel < 2) gradeLevel = '2' // TODO: randomize later?
    gradeLevel = Math.floor(gradeLevel); // In case of float
    let key = 'grade' + gradeLevel;
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
