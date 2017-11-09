'use strict';

module.change_code = 1;

const Alexa = require('alexa-app');

const app = new Alexa.app('speller');
const DictionaryDataHelper = require('./dictionary_data_helper');

app.launch( (req, res) => {
  const prompt = 'Hello! You can ask me for a word, and specify by grade two through eight, if you like.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
})

app.intent('randomword', {
  slots: {
    GradeLevel: 'level'
  },
  // utterances: ['{|random} {|word} {|grade} {-|GRADELEVEL}']
  utterances: ['give me a random word', 'give me a word from grade {GradeLevel}']
},
  (req, res) => {
    // Get the slot
    const gradeLevel = req.slot('GradeLevel');
    const reprompt = 'Ask me for a word, and specify by grade two through eight, if you like.';
    let word;
    try {
      if (!gradeLevel) word = DictionaryDataHelper.getRandomWord()
      // Check here for valid input?
      else word = DictionaryDataHelper.getRandomWord(gradeLevel);
      res.say('Your word is ' + word + '. Ok, you\'re welcome.').send();
    }
    catch (err) {
      console.log(err.statusCode);
      let prompt = 'Hmm, something went wrong. Let\'s try again.';
      res.say(prompt).reprompt(prompt).shouldEndSession(false).send();
    }
    return false;
  }
)

module.exports = app;
