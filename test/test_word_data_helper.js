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
      //TODO: Specific to the Pearson API, change for Macmillan
      it('returns a matching definition', () => {
        word = 'test'
        let testDefinition = 'to scientifically examine a substance or object in order to find out something';
        let apiDefinition = dictionaryHelper.requestDefinition(word)
        .then( data => {
          return data.results[0].senses[0].definition;
        });
        return expect(apiDefinition).to.eventually.eq(testDefinition)
      })
    })
    context('with an unrecognized word request', () => {
      //TODO: Specific to the Pearson API, change for Macmillan
      it('returns an empty response', () => {
        word = 'wheredidthetimego'
        let resultsLength = 0;
        let apiDefinitionLength = dictionaryHelper.requestDefinition(word)
        .then( data => {
          return data.results.length;
        });
        return expect(apiDefinitionLength).to.eventually.eq(resultsLength)
      })
    })
  })


});
