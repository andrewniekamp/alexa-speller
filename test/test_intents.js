'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.config.includeStack = true;

const firebase = require('firebase');

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'alexa-speller.firebaseapp.com',
  databaseURL: 'https://alexa-speller.firebaseio.com',
  projectId: 'alexa-speller',
  storageBucket: 'alexa-speller.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

const expect = chai.expect;

const DatabaseHelper = require('../apps/speller/database_helper');

describe('Intents', () => {

  describe('getWord', () => {
    context('with a request with a valid word', () => {
      it('gets the word', () => {
        // THIS WORKS, MUST USE THIS!!!!
        const userId = 'AE3MUH66U';
        let word;
        return firebase.database().ref('/users/' + userId).once('value')
        .then(function(snapshot) {
          word = snapshot.val().word;
          expect(word).to.eq('pickles');
        });
      })
    })
  })
});
