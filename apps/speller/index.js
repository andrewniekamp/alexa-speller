'use strict';
require('dotenv').config()

const Alexa = require('alexa-app');

const firebase = require('firebase');

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'alexa-speller.firebaseapp.com',
  databaseURL: 'https://alexa-speller.firebaseio.com',
  projectId: 'alexa-speller',
  storageBucket: 'alexa-speller.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};

const app = new Alexa.app('speller');
const DictionaryDataHelper = require('./dictionary_data_helper');

app.appId = process.env.ALEXA_APP_ID;

app.launch((req, res) => {
  const prompt = 'Hello! You can ask me for a word, and specify by grade two through eight, if you like.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
})

app.intent('RandomWordIntent', (req, res) => {
  const fbApp = firebase.initializeApp(config);
  // Get the slot
  const gradeLevel = req.slot('GradeLevel');
  // const reprompt = 'Ask me for a word, and specify by grade two through eight, if you like.';
  let word;
  try {
    if (!gradeLevel) word = DictionaryDataHelper.getRandomWord()
    // Check here for valid input?
    else word = DictionaryDataHelper.getRandomWord(gradeLevel);

    const userId = req.userId.split('.').join(''); // Must remove '.' from id
    return firebase.database().ref(`users/${userId}`).set({ word })
    .then( () => fbApp.delete())
    .then( () => {
      res.say('Your word is ' + word + '. Ok, you\'re welcome.').send();
    })
    .catch(console.log);
  }
  catch (err) {
    console.log(err.statusCode);
    let prompt = 'Hmm, something went wrong. Let\'s try again.';
    res.say(prompt).reprompt(prompt).shouldEndSession(false).send();
  }
  return false;
})

app.intent('GetWordIntent', (req, res) => {
  const fbApp = firebase.initializeApp(config);
  const userId = req.userId.split('.').join(''); // Must remove '.' from id
  let word;
  return firebase.database().ref('/users/' + userId).once('value')
  .then( data => {
    word = data.val().word;
    return fbApp.delete();
  })
  .then( () => {
    return res.say('You want your word again? Ok, it\'s ' + word + '.').shouldEndSession(false).send();
  });
})

module.exports = app;
