'use strict';

// Load the module dependencies
var config = require('../config'),
  path = require('path'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  cookieParser = require('cookie-parser'),
  passport = require('passport'),
  socketio = require('socket.io'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session);

// Define the Socket.io configuration method
module.exports = function (app, db) {
  var server;
  if (config.secure && config.secure.ssl === true) {
    // Load SSL key and certificate
    var privateKey = fs.readFileSync(path.resolve(config.secure.privateKey), 'utf8');
    var certificate = fs.readFileSync(path.resolve(config.secure.certificate), 'utf8');
    var caBundle;

    try {
      caBundle = fs.readFileSync(path.resolve(config.secure.caBundle), 'utf8');
    } catch (err) {
      console.log('Warning: couldn\'t find or read caBundle file');
    }

    var options = {
      key: privateKey,
      cert: certificate,
      ca: caBundle,
      //  requestCert : true,
      //  rejectUnauthorized : true,
      secureProtocol: 'TLSv1_method',
      ciphers: [
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'DHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-SHA256',
        'DHE-RSA-AES128-SHA256',
        'ECDHE-RSA-AES256-SHA384',
        'DHE-RSA-AES256-SHA384',
        'ECDHE-RSA-AES256-SHA256',
        'DHE-RSA-AES256-SHA256',
        'HIGH',
        '!aNULL',
        '!eNULL',
        '!EXPORT',
        '!DES',
        '!RC4',
        '!MD5',
        '!PSK',
        '!SRP',
        '!CAMELLIA'
      ].join(':'),
      honorCipherOrder: true
    };

    // Create new HTTPS Server
    server = https.createServer(options, app);
  } else {
    // Create a new HTTP server
    server = http.createServer(app);
  }
  // Create a new Socket.io server
  var io = socketio.listen(server);

  // Create a MongoDB storage object
  var mongoStore = new MongoStore({
    mongooseConnection: db.connection,
    collection: config.sessionCollection
  });

  // Intercept Socket.io's handshake request
  io.use(function (socket, next) {
    // Use the 'cookie-parser' module to parse the request cookies
    cookieParser(config.sessionSecret)(socket.request, {}, function (err) {
      // Get the session id from the request cookies
      var sessionId = socket.request.signedCookies ? socket.request.signedCookies[config.sessionKey] : undefined;

      if (!sessionId) return next(new Error('sessionId was not found in socket.request'), false);

      // Use the mongoStorage instance to get the Express session information
      mongoStore.get(sessionId, function (err, session) {
        if (err) return next(err, false);
        if (!session) return next(new Error('session was not found for ' + sessionId), false);

        // Set the Socket.io session information
        socket.request.session = session;

        // Use Passport to populate the user details
        passport.initialize()(socket.request, {}, function () {
          passport.session()(socket.request, {}, function () {
            if (socket.request.user) {
              next(null, true);
            } else {
              next(new Error('User is not authenticated'), false);
            }
          });
        });
      });
    });
  });

// this code added by hunter
// one queue per topic, add users to all possible topic queues
// creating a pairing function for users based on a queue, hunter's somewhat fix to solving the pairing issue
// based on example found within stackoverflow
  var queue = [];
  var rooms = {};
  var uNames = {};
  var allUsers = {};

  var pairLoneUsers = function(socket){

    if(queue){
      var other = queue.pop(); // pops someone off of the queue if there is at least one user in it
      var room = socket.id+'#'+other.id; // makes a room based on the two id's of the users

      other.join(room); // makes the other person join the room
      socket.join(room); //puts the user into the room
      // register the rooms to their names
      rooms[other.id] = room;
      rooms[socket.id] = room;
      // emit the names of those within the chat 
      other.emit('chat open', { 'name': uNames[socket.id], 'room': room } );
      socket.emit('chat open', { 'name': uNames[other.id], 'room': room});
    }else{
      // if nobody is in the queue, add someone 
      // will be popped later to populate the place
      queue.push(socket);
    }
  };
  // end of code added by hunter

  // Add an event listener to the 'connection' event
  io.on('connection', function(socket) {
    console.log('User: ' + socket.id + 'connected'); // print that someone connected

    // connecting to a room
    socket.on('login', function(data){
      // populate username arrays accordingly 
      uNames[socket.id] = data.username; 
      allUsers[socket.id] = socket;
      // once users login blanket add them to all queues 
      // constantly poll the queues to see if there are more than 2 free people 
      // then pair them 

      // pair users based on the socket
      pairLoneUsers(socket);
    });

    // when a user sends a message they will broadcast it to the specific room
    socket.on('message', function(data){
      var room = rooms[socket.id];
      socket.broadcast.to(room).emit('message', data);
    });

    // leaving a room
    socket.on('logout', function(data){
      var room = rooms[socket.id];
      socket.broadcast.to(room).emit('Chat ending');
      // splits the room in two based on the # included earlier
      var otherID = room.split('#');  
      // sorts the id's of the socket so that it doenst get paired with the same person again
      otherID = otherID[0] === socket.id ? otherID[1] : otherID[0];
      // add both users back on the queue to chat again
      pairLoneUsers(allUsers[otherID]);
      pairLoneUsers(socket);
    });

    // disconnecting from a room
    // essentially the same as the logout function, but only if one of the users decides to leave
    socket.on('disconnect', function(data){
      var room = rooms[socket.id];
      socket.broadcast.to(room).emit('Chat end');
      var otherID = room.split('#');
      otherID = otherID[0] === socket.id ? otherID[1] : otherID[0];

      // only add the other user to the queue as the socket itself disconnects
      pairLoneUsers(allUsers[otherID]);
    });


    // testing new code so Hunter commented out everything below to figure out another solution to the pairing issue
    // new code below this line
//     var rooms = ['room1', 'room2'];
//     var users = { };
//     // sets up the rooms
//     socket.emit('setup', {
//       room: rooms
//     });

//     // this function connects people to a room based on an interest
//     // data is an interest, nsp would be the namespace
//     socket.on('interestRoom', function interestRoom(data){
//       var nsp = io.of('/' + data);
//     });

//     // this function is for messaging specific interest rooms
//     socket.on('interestmsg', function interestMsg(data){
//       var msg = data.msg;
//       var nsp = data.nsp;
//       io.of(nsp).emit('message',msg);
//     });
    

//     // this is the add user function, it adds users to a specific room based on their username
//     socket.on('adduser', function addUser (username) {
//       socket.room = 'room1';// sets the room to room1 aka default room
//       socket.username = username;// sets username
//       socket.join('room1');// lets user join room1
//       socket.emit('updatechat', 'SERVER', 'you are in room1');// emit message
//       socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
//       socket.emit('updaterooms', rooms, 'room1');
//     });

//     // function for switching rooms
//     socket.on('switchroom', function switchRoom (data) {
//       socket.leave(data.oldRoom);// leave the old room
//       socket.join(data.newRoom);
//       io.in(data.oldRoom).emit('user left', data);
//       io.in(data.newRoom).emit('user joined', data);
//     });

//     // this function is designed for the creation of new rooms
//     // room being the name of the specific room
//     socket.on('create', function(room) {
//       socket.join(room);
//     });

//     // // create the schema for things to be sacved to the database
//     // var msgSchema = mongoose.Schema({
//     //   msg: String,
//     //   created: {type: Date, default: Date.now}
//     // });

//     // // below is the code associated to saving chat messages
//     // var Chat = mongoose.model('Message',msgSchema);// makes the object for the chat messages to be saved
//     // // this function is designed to save messages to the database
//     // socket.on('sendMsg', function(data){//data is the message being sent by the user
//     //   var newMsg = new Chat({msg: '', + data});
//     //   console.log('saving msg' + newMsg);// logs the message
//     //   newMsg.save(function(err){
//     //     console.log('saved, err = ' + err);
//     //     if(err){// if there is an error throw it
//     //       throw err;
//     //     }
//     //     console.log('echoing back data: ' + data);// else log the data
//     //     io.sockets.emit('new message', data);// then emit the message data
//     //   });
//     // });

//   socket.on('catalogueusers', function(room){
//   //array of users belonging to room
//   var roomUsers = [];

//   //form list of users in room
//   for (var i = 0; i < io.users.length; i++) {
//     var user = io.users[i];
//     if (user.room === room) {
//       roomUsers.push(user);
//     }
//   }
//     //match users from room
//    matchUsers(roomUsers, room);
// });

//     // creates a new room if there are more than two users in a given room
//     socket.on('matchUsers', function(roomUsers, room){
//       for (var i = 0; i < roomUsers.length; i+=2) {
//         if ((roomUsers.length-i)/2 >0){// if there are at least two users in room

//       // create new room for two people
//       var newRoom = room+''+io.rooms.length;
//       socket.create(newRoom);

//       // switch people into new rooms
//       var data = {
//         newRoom: newRoom,
//         oldRoom: room
//       };
//       roomUsers[i].emit('switchroom', data);
//       // roomUsers[i].emit('updaterooms', rooms, newRoom);
//       roomUsers[1+i].emit('switchroom', data);
//       // roomUsers[1+i]emit('updaterooms', rooms, newRoom);
//     }
//   }
// });
    // added code above this line

    config.files.server.sockets.forEach(function (socketConfiguration) {
      require(path.resolve(socketConfiguration))(io, socket);
    });
  });

  return server;
};
