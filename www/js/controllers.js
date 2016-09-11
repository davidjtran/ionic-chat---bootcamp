angular.module('starter.controllers', ['app.services', 'bootcamp']);

angular.module('starter.controllers').controller('ChatsCtrl', ['$scope', 'MessagesFirebaseArray', 'AddMessage',
  function($scope, MessagesFirebaseArray, AddMessage) {

    $scope.messages = MessagesFirebaseArray;

    $scope.addMessage = AddMessage;

    $scope.message = {text:""};
  }
]);

angular.module('starter.controllers').controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
