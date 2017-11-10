'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.config.includeStack = true;

const expect = chai.expect;

const DatabaseHelper = require('../apps/speller/database_helper');

describe('DatabaseHelper', () => {
  let word;

  describe('storeWordData', () => {
    context('with a request with a valid word', () => {
      it('saves the word to the db', () => {
        word = 'test';
        let status = DatabaseHelper.storeWordData('0testId', word)
        .then(res => res);
        expect(status).to.eventually.eq('Success');
      })
    })
  })
  describe('readWordData', () => {
    context('with any request for an existing word', () => {
      it('retrieves the word from the db', () => {
        word = DatabaseHelper.readWordData('0testId')
        .then(res => {
          return res;
        });
        expect(word).to.eventually.eq('test');
      })
    })
  })
});
