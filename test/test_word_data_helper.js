'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.config.includeStack = true;

const expect = chai.expect;

// Will bring a JSON response of a requested word.
const DictionaryDataHelper = require('../dictionary_data_helper');

describe('DictionaryDataHelper', () => {
  let dictionaryHelper = new DictionaryDataHelper();
  let word;

  describe('getDictionaryInfo', () => {
    context('with a valid word request', () => {
      it('returns a matching definition', () => {
        word = 'test'
        let testDefinition = 'to scientifically examine a substance or object in order to find out something';
        let apiDefinition = dictionaryHelper.requestDefinition(word)
        .then( data => {
          //TODO: Specific to the Pearson API, change for Macmillan
          return data.results[0].senses[0].definition;
        });
        return expect(apiDefinition).to.eventually.eq(testDefinition)
      })
    })
  })


});
