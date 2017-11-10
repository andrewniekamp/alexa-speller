'use strict';

const firebase = require('firebase');

var config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'alexa-speller.firebaseapp.com',
  databaseURL: 'https://alexa-speller.firebaseio.com',
  projectId: 'alexa-speller',
  storageBucket: 'alexa-speller.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

class DatabaseHelper {

  static storeWordData(userId, word) {
    return firebase.database().ref('users/' + userId).set({ word })
    .then( () => 'Success')
    .catch(console.log);
  }

  static readWordData(userId) {
    return firebase.database().ref('/users/' + userId).once('value')
    .then( (data) => {
      return data.val().word;
    });
  }
}

module.exports = DatabaseHelper;
