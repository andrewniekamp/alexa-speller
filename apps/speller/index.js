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

const DictionaryDataHelper = require('./dictionary_data_helper');

var handlers = {
  PleaseHelpIntent: function () {
    this.emit(':tell', 'Hello World!');
  },
  LaunchRequest: function () {
    let prompt = 'Hello! You can ask me for a word, and specify by grade two through eight, if you like.';
    let cardTitle = 'Hello.'
    let cardContent = 'You can ask me for a word, and specify by grade two through eight, if you like.';
    let imageObj = {
      smallImageUrl: `https://source.unsplash.com/720x480/?bee`,
      largeImageUrl: `https://source.unsplash.com/1200x800/?bee`
    };
    this.emit(':askWithCard', prompt, prompt, cardTitle, cardContent, imageObj);
  },
  RandomWordIntent: function () {
    const fbApp = firebase.initializeApp(config);
    // Get the slot
    // const gradeLevel = 0;
    const gradeLevel = this.event.request.intent.slots.GradeLevel.value;
    // const reprompt = 'Ask me for a word, and specify by grade two through eight, if you like.';
    let word;
    try {
      if (!gradeLevel) word = DictionaryDataHelper.getRandomWord()
      // Check here for valid input?
      else word = DictionaryDataHelper.getRandomWord(gradeLevel);

      const userId = this.event.context.System.user.userId.split('.').join(''); // Must remove '.' from id
      return firebase.database().ref(`users/${userId}`).set({ word })
        .then(() => fbApp.delete())
        .then(() => {
          let wordLines = ''
          for (let i = 0; i < word.length; i++) {
            wordLines += '_ '
          }
          wordLines.trim();
          let cardTitle = wordLines;

          let prompt = `Your word is, ${word}.`;
          let reprompt = `If you are ready to spell just say, ready, and then spell the word.`
          let cardContent = 'If you are ready to spell just say, "Ready," and then spell the word.';
          let imageObj = {
            smallImageUrl: `https://source.unsplash.com/720x480/?${word}`,
            largeImageUrl: `https://source.unsplash.com/1200x800/?${word}`
          };
          this.emit(':askWithCard', prompt, reprompt, cardTitle, cardContent, imageObj);
        })
        .catch(console.log);
    }
    catch (err) {
      console.log(err.statusCode);
      let prompt = 'Hmm, something went wrong. Let\'s try again.';
      this.emit(':tell', prompt);
    }
  },
  GetWordIntent: function () {
    const fbApp = firebase.initializeApp(config);
    const userId = this.event.context.System.user.userId.split('.').join(''); // Must remove '.' from id
    let word;
    return firebase.database().ref('/users/' + userId).once('value')
      .then(data => {
        word = data.val().word;
        return fbApp.delete();
      })
      .then(() => {
        let wordLines = ''
        for (let i = 0; i < word.length; i++) {
          wordLines += '_ '
        }
        wordLines.trim();
        let cardTitle = wordLines;

        let prompt = `Your word is, ${word}.`;
        let reprompt = `If you are ready to spell just say, ready, and then spell the word.`
        let cardContent = 'If you are ready to spell just say, "Ready," and then spell the word.';
        let imageObj = {
          smallImageUrl: `https://source.unsplash.com/720x480/?${word}`,
          largeImageUrl: `https://source.unsplash.com/1200x800/?${word}`
        };
        this.emit(':askWithCard', prompt, reprompt, cardTitle, cardContent, imageObj);
      })
      .catch((err) => {
        console.log(err.statusCode);
        let prompt = 'Hmm, something went wrong. Let\'s try again.';
        this.emit(':tell', prompt);
      });
  },
  CheckSpellingIntent: function () {
    const fbApp = firebase.initializeApp(config);
    const userId = this.event.context.System.user.userId.split('.').join(''); // Must remove '.' from id
    let spelledWord;
    if (this.event.request.intent.slots.SpellingLetter.value) spelledWord = this.event.request.intent.slots.SpellingLetter.value.toLowerCase();
    let word;
    return firebase.database().ref('/users/' + userId).once('value')
    .then( data => {
      word = data.val().word;
      return fbApp.delete();
    })
    .then( () => {
      if (spelledWord === word) {
        let prompt = 'Correct! You are so smart! You spelled ' + word + ' correctly!';
        return this.emit(':tell', prompt);
      } else {
        let wordLines = ''
        for (let i = 0; i < word.length; i++) {
          wordLines += '_ '
        }
        wordLines.trim();
        let cardTitle = wordLines;

        let prompt = 'Hmm... that doesn\'t seem right, but you can try again. In case you forgot, your word is ' + word + '.';
        let reprompt = `If you are ready to spell just say, ready, and then spell the word.`
        let cardContent = 'If you are ready to spell just say, "Ready," and then spell the word.';
        let imageObj = {
          smallImageUrl: `https://source.unsplash.com/720x480/?${word}`,
          largeImageUrl: `https://source.unsplash.com/1200x800/?${word}`
        };
        this.emit(':askWithCard', prompt, reprompt, cardTitle, cardContent, imageObj);
      }
    })
    .catch( (err) => {
      console.log(err.statusCode);
      return fbApp.delete()
      .then( () => {
        let prompt = 'Hmm, something went wrong. Let\'s try again.';
        this.emit(':tell', prompt);
      })
    });
  }
};

exports.handler = function (event, context, callback) {
  var alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
