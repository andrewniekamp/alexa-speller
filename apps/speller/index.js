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

  RandomWordIntent: function () {
    const gradeLevel = this.event.request.intent.slots.GradeLevel.value;
    let word;
    if (!gradeLevel) word = WordHelper.getRandomWord()
    else word = WordHelper.getRandomWord(gradeLevel);

    this.attributes.word = word;
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

  GetWordIntent: function () {
    let word;
    if (this.attributes.word) word = this.attributes.word;
    else this.emit(':ask', 'You don\'t have a word yet. Do you want one?', 'You don\'t have a word yet.');

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

  CheckSpellingIntent: function () {
    let word = this.attributes.word;
    let spelledWord = this.event.request.intent.slots.SpellingLetter.value;
    if (!word) this.emit(':ask', 'You don\'t have a word yet. Do you want one?', 'You don\'t have a word yet.');
    if (spelledWord) spelledWord = WordHelper.formatSpelledWord(spelledWord); // If they spelled something, format it
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
  // 'AMAZON.HelpIntent': function () {
  //   this.emit(':ask', 'Describe the app and what you can ask for--make this a card', 'Try *****.');
  // },

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
