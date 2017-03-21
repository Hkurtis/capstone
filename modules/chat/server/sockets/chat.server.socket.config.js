'use strict';
var connected = false;
var username = 'Dan';
var room =''; // blank at first 
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected

  io.emit('chatMessage', {
    type: 'status',
    text: 'Is now connected',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    username: socket.request.user.username
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;
    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
  });
  // hunter added code below
  socket.on('connect', function(data){
    connected = true;
    if(username){
      socket.emit('login', {'username': username});
    }
  });
  // chat start function
  socket.on('chat open', function(data){
    room = data.room;
    // function to show chat window?
  });
  // chat end function
  socket.on('chat end', function(data){
    // some function to shift back to the homepage
    socket.leave(room);
    room = ''; // blank out room again
  });
  // disconnect function
  socket.on('disconnect', function(data){
    console.log('connection is bad or browser issue');
  });
  // function for sending a message
  var sendMsg = function(msg){
    // if a user is connected emit the message to the room
    if(connected){
      socket.emit('message', {'text': msg});
    }
  };
  // function for leaving the chat
  var leaveChat = function(){
    // if a user is connected emit the logout function
    // then leave the room
    if(connected){
      socket.emit('logout');
      socket.leave(room);
      room = ''; // blank out room
    }
  }
  // hunter added code above

  // commented out disconnect function to see what happens when new one is written
  // Emit the status event when a socket client is disconnected
  // socket.on('disconnect', function () {
  //   io.emit('chatMessage', {
  //     type: 'status',
  //     text: 'disconnected',
  //     created: Date.now(),
  //     profileImageURL: socket.request.user.profileImageURL,
  //     username: socket.request.user.username
  //   });
  // });
};
