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

  static getRandomWord(level) {
    // Checking for user or Alexa bad input, or no input
    let options = ['easy', 'medium', 'hard'];
    if (level) level = level.toLowerCase().trim();
    if (!level || !options.includes(level)) level = options[Math.floor(Math.random() * (options.length))];
    let randomIndex = Math.floor(Math.random() * (wordData[level].length));
    let word = wordData[level][randomIndex];
    return word;
  }

  static getSpaces(word) {
    let wordLines = ''
    for (let i = 0; i < word.length; i++) { wordLines += '_ ' } // Makes blank spaces for letters
    wordLines.trim();
    return wordLines;
  }

  static getSpelling(word) {
    let spelling = ''
    for (let i = 0; i < word.length; i++) {
      spelling += word[i] + '. ';
    }
    spelling.trim();
    return spelling;
  }

  static formatSpelledWord(spokenInput) {
    return spokenInput.replace(/[\s\.]/g, '').toLowerCase();
  }

  static createWordCard(wordObj, instructions) {
    if (wordObj) {
      let { word, part, synonym, definition, examplePre, examplePost, source, reqPart, reqDefinition, reqSynonym, reqExample, reqAnswer } = wordObj;
      let card = { cardContent: '' };
      if (reqAnswer) { card.cardContent += `Answer: ${word}\n\n`}
      if (reqPart) { card.cardContent += `Part of Speech: ${part}\n\n` }
      if (reqSynonym) { card.cardContent += `Synonym: ${synonym}\n\n` }
      if (reqDefinition) { card.cardContent += `Definition:\n ${definition}\n\n` }
      let wordLines = DictionaryDataHelper.getSpaces(word);
      if (reqExample) { card.cardContent += `Example:\n ${examplePre + wordLines + examplePost}\n    ${source}\n\n` }

      if (instructions) card.cardContent = `For example, to spell "cat" you would say:\n\n"Ready c a t"\n\nYou can ask for part of speech, synonym, definition, an example, or the answer.`

      card.cardTitle = 'Say "Ready" and then spell the word!';
      card.imageObj = {
        smallImageUrl: `https://source.unsplash.com/720x480/?${word}`,
        largeImageUrl: `https://source.unsplash.com/1200x800/?${word}`
      };
      return card;
    }
    // let prompt = `Hmm... that doesn't seem right, but you can try again. In case you forgot, your word is ${word}.`;
    // let reprompt = `If you are ready to spell just say, ready, and then spell the word.`;

    // let cardTitle = WordHelper.getSpaces(word);
    // let cardContent = `If you are ready to spell just say, "Ready," and then spell the word.`;
    // let imageObj = {
    //   smallImageUrl: `https://source.unsplash.com/720x480/?${word}`,
    //   largeImageUrl: `https://source.unsplash.com/1200x800/?${word}`
    // };
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
