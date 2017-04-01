'use strict';
// one queue per topic, add users to all possible topic queues
// creating a pairing function for users based on a queue, hunter's somewhat fix to solving the pairing issue
// based on example found within stackoverflow
  var queue = [];
  var rooms = {};
  var uNames = {};
  var allUsers = {};

  exports.pairLoneUsers = function(socket){

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