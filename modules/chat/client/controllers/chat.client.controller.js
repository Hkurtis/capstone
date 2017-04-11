(function () {
  'use strict';
  //var matchUsers = require('../../lib/matchUsers');
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
    
    function getquery() {
      var path = require('path'),
        mongoose = require('mongoose'),
        db = mongoose.model('Topics'),
        errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

        var rand = Math.random();
        var rand2 = Math.random();
        var topic = db.collection('Topics').find({name:1}).limit(-1).skip(rand).next();
        var prompt = db.collection('Topics').find({name: topic}, {prompt:1}).limit(-1).skip(rand2).next();

        document.getElementById("Topic").innerHTML = topic;
        document.getElementById("Prompt").innterHTML = topic;

    }

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
    var socketid = Socket.id;
    function sendMessage() {
      // Create a new message object
      var message = {
        text: vm.messageText
      };
      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);
      io.to(socketid).emit('message', message);
      console.log("text: "+ vm.messageText);
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

