require('dotenv').config()

const firebase = require('firebase');
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'alexa-speller.firebaseapp.com',
  databaseURL: 'https://alexa-speller.firebaseio.com',
  projectId: 'alexa-speller',
  storageBucket: 'alexa-speller.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};

const Alexa = require('alexa-sdk');
const APP_ID = process.env.ALEXA_APP_ID;

const WordHelper = require('./dictionary_data_helper');
const cards = require('./data/cards');

var handlers = {

  LaunchRequest: function () {
    let card = cards.launchCard;
    // Save initially for general usage
    this.attributes.userId = this.event.context.System.user.userId.split('.').join('');
    this.emit(':askWithCard', card.prompt, card.prompt, card.title, card.content, card.imgObj);
  },

  GetWordIntent: function () {
    const level = this.event.request.intent.slots.GradeLevel.value;
    let wordObj = WordHelper.getRandomWord(level) // Pass in, even if undefined
    let word = wordObj.word;
    this.attributes.word = wordObj; // Set entire word object

    let prompt = `Your word is, ${word}.`;
    let reprompt = `If you are ready to spell just say, ready, and then spell the word.`;
    let cardTitle = WordHelper.getSpaces(word); // Gets space placeholders for letters
    let cardContent = 'If you are ready to spell just say, "Ready," and then spell the word.';
    let imageObj = {
      smallImageUrl: `https://source.unsplash.com/720x480/?${word}`,
      largeImageUrl: `https://source.unsplash.com/1200x800/?${word}`
    };
    this.emit(':askWithCard', prompt, reprompt, cardTitle, cardContent, imageObj);
  },

  RetrieveWordIntent: function () {
    let wordObj;
    if (this.attributes.word) wordObj = this.attributes.word;
    else this.emit(':ask', 'You don\'t have a word yet. Do you want one?', 'You don\'t have a word yet.');
    let word = wordObj.word;

    let cardTitle = WordHelper.getSpaces(word); // Gets space placeholders for letters
    let prompt = `Your word is, ${word}.`;
    let reprompt = `If you are ready to spell just say, ready, and then spell the word.`
    let cardContent = 'If you are ready to spell just say, "Ready," and then spell the word.';
    let imageObj = {
      smallImageUrl: `https://source.unsplash.com/720x480/?${word}`,
      largeImageUrl: `https://source.unsplash.com/1200x800/?${word}`
    };
    this.emit(':askWithCard', prompt, reprompt, cardTitle, cardContent, imageObj);
  },

  RetrieveDefinitionIntent: function () {
    if (!this.attributes.word) this.emit(':ask', 'You don\'t have a word yet. Do you want one?', 'You don\'t have a word yet.');
    this.attributes.word.reqDefinition = true; // Set bool on session
    let wordObj = this.attributes.word; // Get wordObj including updated bool
    let { definition } = wordObj;

    let card = WordHelper.createWordCard(wordObj);

    let prompt = `Here is your definition. ${definition}`;
    let reprompt = `If you are ready to spell just say, ready, and then spell the word. If you need help, say, help.`;

    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING!', card.imageObj || 'IMAGE MISSING!');
  },

  RetrieveSynonymIntent: function () {
    if (!this.attributes.word) this.emit(':ask', 'You don\'t have a word yet. Do you want one?', 'You don\'t have a word yet.');
    this.attributes.word.reqSynonym = true; // Set bool on session
    let wordObj = this.attributes.word; // Get wordObj including updated bool
    let { synonym } = wordObj;

    let card = WordHelper.createWordCard(wordObj);

    let prompt = `A synonym is ${synonym}`;
    let reprompt = `If you are ready to spell just say, ready, and then spell the word. If you need help, say, help.`;

    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING!', card.imageObj || 'IMAGE MISSING!');
  },

  RetrievePartIntent: function () {
    if (!this.attributes.word) this.emit(':ask', 'You don\'t have a word yet. Do you want one?', 'You don\'t have a word yet.');
    this.attributes.word.reqPart = true; // Set bool on session
    let wordObj = this.attributes.word; // Get wordObj including updated bool
    let { part } = wordObj;

    let card = WordHelper.createWordCard(wordObj);

    let prompt = `The part of speech is ${part}`;
    let reprompt = `If you are ready to spell just say, ready, and then spell the word. If you need help, say, help.`;

    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING!', card.imageObj || 'IMAGE MISSING!');
  },

  RetrieveExampleIntent: function () {
    if (!this.attributes.word) this.emit(':ask', 'You don\'t have a word yet. Do you want one?', 'You don\'t have a word yet.');
    this.attributes.word.reqExample = true; // Set bool on session
    let wordObj = this.attributes.word; // Get wordObj including updated bool
    let { exampleFull } = wordObj;

    let card = WordHelper.createWordCard(wordObj);

    let prompt = `Here is your example. ${exampleFull}`;
    let reprompt = `If you are ready to spell just say, ready, and then spell the word. If you need help, say, help.`;

    this.emit(':askWithCard', prompt, reprompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING!', card.imageObj || 'IMAGE MISSING!');
  },

  RetrieveAnswerIntent: function () {
    if (!this.attributes.word) this.emit(':ask', 'You don\'t have a word yet. Do you want one?', 'You don\'t have a word yet.');
    this.attributes.word.reqAnswer = true; // Set bool on session
    let wordObj = this.attributes.word; // Get wordObj including updated bool
    let { word } = wordObj;

    let card = WordHelper.createWordCard(wordObj);

    let prompt = `The word is, ${word}`;

    this.emit(':tellWithCard', prompt, card.cardTitle || 'TITLE MISSING!', card.cardContent || 'CONTENT MISSING!', card.imageObj || 'IMAGE MISSING!');
  },

  CheckSpellingIntent: function () {
    let wordObj = this.attributes.word;
    let word;
    let spelledWord = this.event.request.intent.slots.SpellingLetter.value;
    if (!wordObj) this.emit(':ask', 'You don\'t have a word yet. Do you want one?', 'You don\'t have a word yet.');
    if (spelledWord) spelledWord = WordHelper.formatSpelledWord(spelledWord); // If they spelled something, format it
    word = wordObj.word;
    if (spelledWord === word) {
      let prompt = 'Correct! You are so smart! You spelled ' + word + ' correctly!';
      // Will want to emit a save to firebase for count of words gotten correct
      return this.emit(':tell', prompt);
    } else {
      let cardTitle = WordHelper.getSpaces(word);
      let prompt = `Hmm... that doesn't seem right, but you can try again. In case you forgot, your word is ${word}.`;
      let reprompt = `If you are ready to spell just say, ready, and then spell the word.`;
      let cardContent = `If you are ready to spell just say, "Ready," and then spell the word.`;
      let imageObj = {
        smallImageUrl: `https://source.unsplash.com/720x480/?${word}`,
        largeImageUrl: `https://source.unsplash.com/1200x800/?${word}`
      };
      this.emit(':askWithCard', prompt, reprompt, cardTitle, cardContent, imageObj);
    }
  },

  'AMAZON.HelpIntent': function () {
    let prompt = `If you are ready to spell just say, ready, and then spell the word. You can ask for part of speech, synonym, definition, example, or the answer.`
    this.emit(':ask', prompt, prompt + 'You can also quit at any time by saying, Alexa, quit.');
  },

  // SessionEndedRequest: function () {

  // },

  Unhandled: function () {
     // test for existence of word, if so, ask them to spell it, otherwise tell them to ask for one
    this.emit(':ask', 'Sorry, something went wrong. Let\'s try again.', 'Try again.');
  }
};

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
