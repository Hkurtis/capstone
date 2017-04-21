//var matchUsers = require('../../lib/matchUsers');
(function () {
  'use strict';
  
  //console.log(matchUsers);
  angular
    .module('chat')
    .controller('ChatController', ChatController);
     
  ChatController.$inject = ['$scope', '$state', 'Authentication', 'Socket'];

  function ChatController($scope, $state, Authentication, Socket) {
    var vm = this;

    vm.messages = [];
    vm.messageText = '';
    vm.sendMessage = sendMessage;
    vm.add = add;

    init();

    function init() {
      //matchUsers.pairLoneUsers(Socket.id);
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }

      // Add an event listener to the 'chatMessage' event
      Socket.on('chatMessage', function (message) {
        vm.messages.unshift(message);
      });

      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.removeListener('chatMessage');
      });
    }
    function add(){
      var msg = {
        text: vm.messageText
      }
      Socket.emit('chatMessage', msg);
      console.log("Message: "+vm.messageText);
      vm.messageText = '';
    };
    // eventually this will save messages to the database
    // var msgSchema = new mongoose.Schema({
    //   msg: String,
    //   name: String
    // });
    // Create a controller method for sending messages
    //var partner = matchUsers.getPartner(Socket);
    function sendMessage() {
      // Create a new message object
      var message = {
        text: vm.messageText
      };
      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);// when this sends a chat message it should be broadcasting to their users
      // not just emitting
      //Socket.broadcast.to(Socket).emit('chatMessage', message);
      //Socket.broadcast.to(partner).emit('chatMessage', message);

      console.log('text: '+ vm.messageText);
      // Clear the message text
      vm.messageText = '';
    }
  }
  // // function to save things?
  // var mongoose = require('mongoose');
  // mongoose.connect('mongodb://localhost/test',function (err){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     console.log("Connected to mongodb");
  //   }

  // });
}());

