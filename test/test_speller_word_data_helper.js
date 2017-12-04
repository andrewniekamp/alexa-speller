'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.config.includeStack = true;

const expect = chai.expect;

// Will bring a JSON response of a requested word.
const DictionaryDataHelper = require('../speller/dictionary_data_helper');
const wordData = require('../speller/data/words');

describe('DictionaryDataHelper', () => {
  // let dictionaryHelper = new DictionaryDataHelper();
  let word;

  describe('getRandomWord', () => {
    context('with a request (without optional grade level arg)', () => {
      it('returns any word object', () => {
        let randomWord = DictionaryDataHelper.getRandomWord();
        expect(typeof randomWord).to.eq('object');
        expect(randomWord.length).to.not.eq(0);
      })
    })
    context('with a request (with optional grade level arg)', () => {
      it('returns a word included in the grade level specified in the data', () => {
        let level = 'medium';
        let randomWord = DictionaryDataHelper.getRandomWord(level);
        expect(wordData[level]).to.include(randomWord);
      })
    })
  })
  describe('getDictionaryInfo', () => {
    context('with a valid word request', () => {
      //TODO: Specific to the Pearson API, change for Macmillan
      xit('returns a matching definition', () => {
        word = 'test'
        let testDefinition = 'to scientifically examine a substance or object in order to find out something';
        let apiDefinition = DictionaryDataHelper.requestDefinition(word)
        .then( data => {
          return data.results[0].senses[0].definition;
        });
        return expect(apiDefinition).to.eventually.eq(testDefinition)
      })
    })
    context('with an unrecognized word request', () => {
      //TODO: Specific to the Pearson API, change for Macmillan
      xit('returns an empty response', () => {
        word = 'wheredidthetimego'
        let resultsLength = 0;
        let apiDefinitionLength = DictionaryDataHelper.requestDefinition(word)
        .then( data => {
          return data.results.length;
        });
        return expect(apiDefinitionLength).to.eventually.eq(resultsLength)
      })
    })
  })
  describe('formatDefinition', () => {
    context('with a normal definition', () => {
      it('formats the definition, as expected', () => {
        let testInfo = {
          word: 'test',
          definition: 'to scientifically examine a substance or object in order to find out something'
        };
        expect(DictionaryDataHelper.formatDefinition(testInfo)).to.eq('The definition for the word test, is: "to scientifically examine a substance or object in order to find out something."');
      })
    })
  })
});
