'use strict';
// one queue per topic, add users to all possible topic queues
// creating a pairing function for users based on a queue, hunter's somewhat fix to solving the pairing issue
// based on example found within stackoverflow
  var queue = [];
  var rooms = {};
  var uNames = {};
  var allUsers = {};
  var roomName = "";
  var defaultRoom = "/chat";
  var s;// socket 
  // checks if a specific socket 
  exports.saveSocket = function(socket){
    return socket;
  }
  exports.inQueue = function(socket){
    for(var i = 0; i < queue.length; i++){
      if(queue[i] === socket){
        console.log(socket+' is in the queue');
      }
    }
  };
  
  exports.findRoom = function(){
    var socket = saveSocket();
    if(rooms[socket.id] != null)
      return roomName = rooms[socket.id];
    return defaultRoom;
  }
  // function to print out the room that the current socket user is in
  // primarily used to test if the user actually got placed in a room
  exports.printRoomName = function(socket){
    var userRoom = rooms[socket.id];// get the room
    console.log(userRoom);
    socket.on(room).emit('You are in room: ' + userRoom);// emit this event to the room 
  }

 var other;
 var chatting = {}; // list of booleans 
  //data is the array of all users, socket is the user
  exports.getPartner = function(socket){
    var vm = this;
    if(!allUsers.includes(socket.id)){
        allUsers.push(socket.id);
        // odd # users case
        if(allUsers.length % 2 != 0){
           alert("Sorry there is not enough people to talk to, you have been added to a waiting list, try again soon!"); 
          }
        }else if(allUsers % 2 == 0){// even # users case 
          var person = allUsers.indexOf(allUsers.length);// get last person 
          var partner = { partner1: socket, partner2: person, chatting: true };
          vm.save(partner);
          // somehow notify the system to send messages only to other
        }
      }
      }

  }

  exports.pairLoneUsers = function(socket){
    // if the queue isnt empty
    if(queue.length > 1){
      var other = queue.shift(); // pops someone off of the queue if there is at least one user in it
      var room = socket.id+'#'+other.id; // makes a room based on the two id's of the users
      other.join(room); // makes the other person join the room
      socket.join(room); //puts the user into the room
      // register the rooms to their names
      rooms[other.id] = room;
      rooms[socket.id] = room;
      // emit the names of those within the chat to the chatroom 
      socket.to(room).emit('chat open', { 'name': uNames[socket.id], 'room': room } );
      socket.to(room).emit('chat open', { 'name': uNames[other.id], 'room': room } );
    }else{
      // if nobody is in the queue, add someone 
      // will be popped later to populate the place
      queue.push(socket);
      //inQueue(socket);
      //printRoomName(socket);
    }
  };

  // develop a logout button
  // develop a button that allows users to go into a queue

  // below is code that did not work but kept in order to show the creative process 

  // here is the rough algorithm to enqueue everyone
  // // multi queue method
  // var nonInterestedQ = [];// general queue for people with no interests
  // var interests = [];// populate with interests
  // var q = [];
  // var tmp = [];// tmp queue 
  // var maxUsers = 250;
  // var created = false;
  // var queueScheduler = function(socket, interest){
  //   // if there is no interests 
  //   if(interest == null){// if there is no interests
  //     nonInterestedQ.push(socket);// add user to generic queue
  //   }
  //   if(created == false){
  //     for(i = 0; i < maxUsers; i++ ){// create all queues only once
  //        q = interest[i];// create a queue for every interest;
  //     }
  //   }
  //       created = true;
  //       for(i = 0; i < interests.length(); i++){
  //         tmp = interests[i];
  //         for (j = 0; j < tmp.length();j++){// check each spot in the given queue 
  //           if(tmp[j] != socket.id){// if the user is not within the queue at the given queue;
  //             interests[i].push(socket); //add them to the queue 
  //           }
  //         }
  //         tmp = [];// reset tmp
  //     }
  // };

 // everyone goes in one queue method
  var nonInterestedQ = [];// general queue for people with no interests
  var maxUsers = 250;
  var created = false;
  exports.queueScheduler = function(socket){
    if(created == false){
      nonInterestedQ.push(socket.id);
    }
    created = true;
  };

  var tmp = [];
  var queue = [];
  // function to remove users from all queues they are a part of
  // addition to the queue scheduler function 
  exports.removeFromQueue = function(socket){
    queue = nonInterestedQ;
    // check every queue to see if the socket is present 
    for(i = 0; i < queue.length(); i++){
      tmp = queue[i];
        if(tmp[j] == socket.id){
          tmp.pop(socket.id);
        }
      tmp = [];// resets the tmp array 
      queue = []; // resets the queue array 
    }
  };