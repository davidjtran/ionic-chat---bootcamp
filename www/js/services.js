/* global angular */

angular.module('app.services', ['firebase']);

/*
    The maximum amount of messages that will be loaded into the message feed
*/
angular.module('app.services').constant('MESSAGE_LIMIT', 50);

/*
    Create a factory that we can use to get a Firebase pointing to our /messages.
*/

angular.module("app.services").factory("MessagesFirebaseRef", [
    function() {
        var messageFirebase = new Firebase("https://bootcampchat.firebaseio.com/messages");
        return messageFirebase;
    }
]);

angular.module('app.services').factory('MessagesFirebaseArray', [
  '$firebaseArray', 'MessagesFirebaseRef', 'MESSAGE_LIMIT',
  function($firebaseArray, MessagesFirebaseRef, MESSAGE_LIMIT) {

    function getMostRecentMessages() {
        return MessagesFirebaseRef.orderByChild("timestamp").limitToLast(50);
    }

    function getMessagesFirebaseArray() {
        return $firebaseArray(getMostRecentMessages());
    }

    return getMessagesFirebaseArray();
  }
]);

angular.module('app.services').factory('AddMessage', ['AuthManager', 'MessagesFirebaseArray', '$q',
  function(AuthManager, MessagesFirebaseArray, $q) {

    var uid;

    function getUid() {
      if (uid) {
        return $q.when(uid);
      } else {
        return AuthManager.getAuth()
          .then(setUid);
      }
    }

    function setUid(authData) {
      uid = authData.uid;
      return uid;
    }

    function makeMessage(messageText) {
      return {
        message: messageText,
        uid: uid,
        timestamp: Firebase.ServerValue.TIMESTAMP
      };
    }

    /*
      As you can see, we'll be returning this function for use by the controllers.
      The function will have to put a message with the specified text in the
      firebase database. You will have to leverage the Promise ($q) API
    */
    function addMessage(messageText) {
        getUid().then(
            function(uid) {
                return makeMessage(messageText);
            }
        ).then(function(message) {
            console.log("clicked");
            MessagesFirebaseArray.$add(message);
            MessagesFirebaseArray.$save();
        })

    }

    return addMessage;
  }
]);

/*
  this factory returns an array of messages. messages consist of the message text
  ('message'), the string id of the user who posted the message ('user'), and the
  time that the message was created, in milliseconds ('timestamp')
  {
      message: '...',
      user: '...',
      timestamp: '...'
  }
*/

angular.module('app.services').factory('MockMessages', ['MESSAGE_LIMIT',
  function(MESSAGE_LIMIT) {
    var words = ['hey', 'lol', 'jk', 'rofl', 'k', 'wasup', 'wat', 'u', 'lel', 'brb', 'btw', 'wtf'];

    function generateRandomMessageText() {
      var messageText = '';

      do {
        var randomIndex = Math.floor(Math.random() * words.length);
        messageText += words[randomIndex] + ' ';
      } while (Math.random() > .1); // on average, message consists of ten words

      return messageText;
    }

    /*
        These mock messages are generated out of a random message text, a fake
        user uid, and the current time in milliseconds.
    */
    function generateMessage() {
      return {
        message: generateRandomMessageText(),
        user: 'this is a mock uid',
        timestamp: Date.now()
      };
    }

    var messages = [];

    for (var i = 0; i < MESSAGE_LIMIT; i++) {
      messages.push(generateMessage());
    }

    return messages;
  }
]);
