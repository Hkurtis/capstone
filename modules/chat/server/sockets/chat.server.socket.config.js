'use strict';
//var connectedUsers ={};
// Create the chat configuration
//var app = require('express')();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);
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

    
    // //saving to database 
    // //I think...?
    // var msg = new Chat({msg: message});
    // msg.save(function(err){
    //   if(err){
    //     throw err;
    //   }else{
    //     io.emit('get msg',message);
    //   }

   // })
    // Emit the 'chatMessage' event
    io.emit('chatMessage', message);
  });

  // var room = 1;//need to change this based on topic
  // //schema for chat messages to be stored
  // var chatSchema = mongoose.schema({
  //   name: String,
  //   msg: String,
  //   created:{ type: Date, default: Date.now}
  // });  
  //model for chat messages to get stored
  // var Chat = mongoose.model("Message", chatSchema);
  // //here is where I want users to be able to join and leave rooms 
  // io.on('connection', function(socket)){
  //   //this allows the user to specify where they are going to join a room
  //   //need to link this up to a button where the user can choose a topic so it will join the right room
  //   socket.on('join',function(roomData){
  //     socket.join(roomData.roomName);

  //   })
  //   //this allows users to leave rooms
  //   socket.on('leave',function(roomData){
  //     socket.leave(roomData.roomName);
  //   })

  // };
  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    io.emit('chatMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      profileImageURL: socket.request.user.profileImageURL,
      username: socket.request.user.username
    });
  });
};
