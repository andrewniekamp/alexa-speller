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
    this.word = word;
    const options = {
      method: 'GET',
      uri: ENDPOINT + word,
      resolveWIthFullResponse: true,
      json: true
    };
    return rp(options);
  }

}

module.exports = DictionaryDataHelper;
