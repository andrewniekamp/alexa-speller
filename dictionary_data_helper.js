'use strict';

const _ = require('lodash');
const rp = require('request-promise');

const ENDPOINT = 'http://api.pearson.com/v2/dictionaries/entries?headword=';

class DictionaryDataHelper {
  constructor() {
    this.word = '';
  }

  requestDefinition(word) {
    return this.getDefinition(word)
    .then( res => {
      return res;
    })
  }

  getDefinition(word) {
    const options = {
      method: 'GET',
      uri: ENDPOINT + word,
      // resolveWIthFullResponse: true,
      json: true
    };
    return rp(options);
  }

  formatDefinition(wordInfo) {
    return _.template('The definition for the word, ${word}, is: "${definition}."')({
      word: wordInfo.word,
      definition: wordInfo.definition
    })
  }

}

module.exports = DictionaryDataHelper;
