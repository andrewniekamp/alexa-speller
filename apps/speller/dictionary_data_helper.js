'use strict';

const wordData = require('./data/words');

class DictionaryDataHelper {

  static hereIsWordPrompt(word) {
    return `Here is your word, ${word}. If you are ready to spell, just say, ready, and then spell the word. You can ask for part of speech, synonym, definition, an example, or the answer.`
  }

  static defaultReprompt() {
    return `If you are ready to spell just say, ready, and then spell the word. If you need help, say, help. `;
  }

  static endReprompt() {
    return `To start over just say, start over. To quit, say, quit. `;
  }

  static noWordPrompt() {
    return `You don't have a word yet. `;
  }

  static needHelpPrompt() {
    return `If you need help, just say, help. `;
  }

  static incorrectPrompt() {
    return `Hmm... that doesn't seem right, but you can try again. `;
  }

  static helpIntentPrompt() {
    return `If you are ready to spell just say, ready, and then spell the word. For example, to spell, cat, you would say, ready, c. a. t. You can ask for part of speech, synonym, definition, an example, or the answer.`;
  }

  static helpIntentReprompt() {
    return `You can also start over by saying, start over, or quit by saying, quit.`;
  }

  static getRandomWord(level) {
    let options = ['easy', 'medium', 'difficult'];
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
      // Using unsplash to get the images
      card.imageObj = {
        smallImageUrl: `https://source.unsplash.com/720x480/?${word}`,
        largeImageUrl: `https://source.unsplash.com/1200x800/?${word}`
      };
      return card;
    }
  }

  static formatDefinition(wordInfo) {
    return `The definition for the word ${wordInfo.word}, is: "${wordInfo.definition}."`;
  }

}

module.exports = DictionaryDataHelper;
