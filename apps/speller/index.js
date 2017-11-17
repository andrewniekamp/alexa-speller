require('dotenv').config()

const Alexa = require('alexa-sdk');
const APP_ID = process.env.ALEXA_APP_ID;

const WordHelper = require('./dictionary_data_helper');
const cards = require('./data/cards');
// Can't immediately invoke as input is needed
const hereIsWordPrompt = WordHelper.hereIsWordPrompt;
const defaultReprompt = WordHelper.defaultReprompt();
const endPrompt = WordHelper.endReprompt();
const noWordPrompt = WordHelper.noWordPrompt();
const needHelpPrompt = WordHelper.needHelpPrompt();
const incorrectPrompt = WordHelper.incorrectPrompt();
const helpIntentPrompt = WordHelper.helpIntentPrompt();
const helpIntentReprompt = WordHelper.helpIntentReprompt();

var handlers = {

  LaunchRequest: function () {
    let card = cards.launchCard;
    // Save initially for general usage
    this.attributes.userId = this.event.context.System.user.userId.split('.').join('');
    this.emit(':askWithCard', card.prompt, card.prompt, card.title, card.content, card.imgObj);
  },

  GetWordIntent: function () {
    const level = this.event.request.intent.slots.Difficulty.value;
    let wordObj = WordHelper.getRandomWord(level) // Pass in, even if undefined
    this.attributes.word = wordObj; // Set entire word object
    let { word } = wordObj;
    let card = WordHelper.createWordCard(wordObj, true); // Flag to get instructions
    let prompt = hereIsWordPrompt(word);
    let reprompt = defaultReprompt;
    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING', card.imageObj || 'IMAGE MISSING!');
  },

  RetrieveWordIntent: function () {
    let wordObj;
    if (this.attributes.word) wordObj = this.attributes.word;
    else this.emit(':ask', 'You don\'t have a word yet. Do you want one?', 'You don\'t have a word yet.');
    let { word } = wordObj;
    let card = WordHelper.createWordCard(wordObj);
    let prompt = `Your word is, ${word}`;
    let reprompt = defaultReprompt;
    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'Say "Help" if you need help!', card.imageObj || 'IMAGE MISSING!');
  },

  RetrieveDefinitionIntent: function () {
    if (!this.attributes.word) this.emit(':ask', 'You don\'t have a word yet. Do you want one?', 'You don\'t have a word yet.');
    this.attributes.word.reqDefinition = true; // Set bool on session
    let wordObj = this.attributes.word; // Get wordObj including updated bool
    let { definition } = wordObj;
    let card = WordHelper.createWordCard(wordObj);
    let prompt = `The definition is, ${definition}`;
    let reprompt = defaultReprompt;
    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING!', card.imageObj || 'IMAGE MISSING!');
  },

  RetrieveSynonymIntent: function () {
    if (!this.attributes.word) this.emit(':ask', noWordPrompt, needHelpPrompt);
    this.attributes.word.reqSynonym = true; // Set bool on session
    let wordObj = this.attributes.word; // Get wordObj including updated bool
    let { synonym } = wordObj;
    let card = WordHelper.createWordCard(wordObj);
    let prompt = `A synonym is, ${synonym}`;
    let reprompt = defaultReprompt;
    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING!', card.imageObj || 'IMAGE MISSING!');
  },

  RetrievePartIntent: function () {
    if (!this.attributes.word) this.emit(':ask', noWordPrompt, needHelpPrompt);
    this.attributes.word.reqPart = true; // Set bool on session
    let wordObj = this.attributes.word; // Get wordObj including updated bool
    let { part } = wordObj;
    let card = WordHelper.createWordCard(wordObj);
    let prompt = `The part of speech is, ${part}`;
    let reprompt = defaultReprompt;
    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING!', card.imageObj || 'IMAGE MISSING!');
  },

  RetrieveExampleIntent: function () {
    if (!this.attributes.word) this.emit(':ask', noWordPrompt, needHelpPrompt);
    this.attributes.word.reqExample = true; // Set bool on session
    let wordObj = this.attributes.word; // Get wordObj including updated bool
    let { exampleFull } = wordObj;
    let card = WordHelper.createWordCard(wordObj);
    let prompt = `An example is, ${exampleFull}`;
    let reprompt = defaultReprompt;
    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING!', card.imageObj || 'IMAGE MISSING!');
  },

  RetrieveAnswerIntent: function () {
    if (!this.attributes.word) this.emit(':ask', noWordPrompt, needHelpPrompt);
    this.attributes.word.reqAnswer = true; // Set bool on session
    let wordObj = this.attributes.word; // Get wordObj including updated bool
    let { word } = wordObj;
    let card = WordHelper.createWordCard(wordObj);
    let spelledWord = WordHelper.getSpelling(word);
    let prompt = `The answer is, ${spelledWord}. Would you like to play again? If so, say, start over. To quit, say, quit.`;
    let reprompt = endPrompt;
    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING!', card.imageObj || 'IMAGE MISSING!');
  },

  CheckSpellingIntent: function () {
    let wordObj = this.attributes.word;
    let word;
    let spelledWord = this.event.request.intent.slots.SpellingLetter.value;
    if (!wordObj) this.emit(':ask', noWordPrompt, needHelpPrompt);
    if (spelledWord) spelledWord = WordHelper.formatSpelledWord(spelledWord); // If they spelled something, format it
    word = wordObj.word;
    if (spelledWord === word) {
      let card = cards.successCard;
      let prompt = 'Correct! You are so smart! You spelled ' + word + ' correctly! Would you like to play again?' + endPrompt;
      let reprompt = endPrompt;
      this.emit(':askWithCard', prompt, reprompt, 'Congratulations!', 'You spelled ' + word + ' correctly!', card.imgObj);
    } else {
      let card = WordHelper.createWordCard(wordObj);
      let prompt = incorrectPrompt + `Your word is ${word}.`;
      let reprompt = defaultReprompt;
      this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || `For example, to spell "cat" you would say:\n\n"Ready c a t"\n\nYou can ask for part of speech, synonym, definition, an example, or the answer.`, card.imageObj || 'IMAGE MISSING!');
    }
  },

  StartOverIntent: function() {
    this.emit('LaunchRequest');
  },

  'AMAZON.HelpIntent': function () {
    let wordObj;
    if (this.attributes) wordObj = this.attributes.word; // Get wordObj including updated bool
    let card = WordHelper.createWordCard(wordObj, true); // true for instructions
    let prompt = helpIntentPrompt;
    let reprompt = helpIntentReprompt;
    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING!', card.imageObj || 'IMAGE MISSING!');
  },

  SessionEndedRequest: function () {
    this.emit(':tellWithCard', 'Goodbye!', 'Goodbye!', 'Thanks for playing!');
  },

  Unhandled: function () {
     this.emitWithState('AMAZON.HelpIntent');
  }
};

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
