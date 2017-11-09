'use strict';

const SPELLER_TABLE_NAME = 'spellerData';
// const dynasty = require('dynasty');

const localUrl = 'http://localhost:8000';
const localCredentials = {
  region: 'us-east-1',
  accessKeyId: 'fake',
  secretAccessKey: 'fake'
};
const localDynasty = require('dynasty')(localCredentials, localUrl);
const dynasty = localDynasty;

const spellerTable = () => {
  return dynasty.table(SPELLER_TABLE_NAME);
};

class SpellerHelper {

  static createSpellerTable() {
    return dynasty.describe(SPELLER_TABLE_NAME)
    .catch( (err) => {
      console.log(err);
      return dynasty.create(SPELLER_TABLE_NAME, {
        key_schema: {
          hash: ['userId', 'string']
        }
      })
    })
  }

  static storeWordData(userId, word) {
    return spellerTable().insert({ userId: userId, data: word })
    .catch( (err) => console.log(err));
  }

  static readWordData(userId) {
    return spellerTable().find(userId)
    .then( (result) => {
      return result;
    })
    .catch( (err) => console.log(err));
  }
}

module.exports = SpellerHelper;
