'use strict';
require('dotenv').config()

const Alexa = require('alexa-app');

const app = new Alexa.app('speller');
const DictionaryDataHelper = require('./dictionary_data_helper');
const DatabaseHelper = require('./database_helper');

const saveWord = (word, req) => {
  const userId = req.userId;
  DatabaseHelper.storeWordData(userId, word)
  .then((result) => result)
  .catch((err) => console.log(err));
}

app.appId = process.env.ALEXA_APP_ID;

app.launch((req, res) => {
  const prompt = 'Hello! You can ask me for a word, and specify by grade two through eight, if you like.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
})

app.intent('RandomWord', {
  slots: {
    GradeLevel: 'level'
  },
  utterances: ['give me a random word', 'give me a word from grade {GradeLevel}']
}, (req, res) => {
  // Get the slot
  const gradeLevel = req.slot('GradeLevel');
  // const reprompt = 'Ask me for a word, and specify by grade two through eight, if you like.';
  let word;
  try {
    if (!gradeLevel) word = DictionaryDataHelper.getRandomWord()
    // Check here for valid input?
    else word = DictionaryDataHelper.getRandomWord(gradeLevel);

    saveWord(word, req); // Passes along req for userId

    res.say('Your word is ' + word + '. Ok, you\'re welcome.').send();
  }
  catch (err) {
    console.log(err.statusCode);
    let prompt = 'Hmm, something went wrong. Let\'s try again.';
    res.say(prompt).reprompt(prompt).shouldEndSession(false).send();
  }
  return false;
})

app.intent('GetWord', {
  utterances: ['what is my word', 'repeat the word']
}, (req, res) => {
  const userId = req.userId;
  return DatabaseHelper.readWordData(userId)
  .then( (result) => {
    let word = result.data;
    return res.say('You want your word again? Ok, it\'s ' + word + '.').shouldEndSession(false).send();
  });
})

module.exports = app;
