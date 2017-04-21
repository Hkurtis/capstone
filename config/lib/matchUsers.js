'use strict';
// one queue per topic, add users to all possible topic queues
// creating a pairing function for users based on a queue, hunter's somewhat fix to solving the pairing issue
// based on example found within stackoverflow
  var queue = [];
  var rooms = {};
  var uNames = {};
  var allUsers = [];
  var pIDS = [];
  var pairedQ = [];
  var roomName = "";
  var defaultRoom = "/chat";
  var s;// socket 

 var other;
 var chatting = {}; // the chatters object?
 function ChatTable() {
  this.pairs = []; // contains all pairs
  this.pIDS = pIDS; // contains all id's
  this.pairedQ = pairedQ;
  this.thingy = []; // I wanna store pairs here
  // this.idx = 0; // index for the given pair
 }

 // pairedQ is a queue of people that are waiting to be paired
 // when someone logs out remove them from the pair and put them in the pairedQ
 ChatTable.prototype = {
  // constructor: ChatTable, // don't necessarily need this
  // p1 = user socket p2 = partner socket (polled from the list of all users)
  put: function(p1, p2) {
    // place the two id's of the sockets p1 and p2 into the pIDS array if they are not present
    if(!this.pIDS.indexOf(p1) >= 0 || !this.pIDS.indexOf(p2) >= 0) {//!this.pIDS.includes(p1) || !this.pIDS.includes(p2)) {
      
      if(!this.pIDS.indexOf(p1) >= 0) {//!this.pIDS.includes(p1)){
        pIDS.push(p1.id);
        //pairedQ.push(p1);
        allUsers.push(p1);
      }
      if(!this.pIDS.indexOf(p2) >= 0) {//!this.pIDS.includes(p1)){
        pIDS.push(p2.id);
        //pairedQ.push(p2);
        allUsers.push(p2);
      }
    }

    // if(!this.pIDS.includes(p1.id))
    //   this.pIDS[p1] = p1.id;
    // if(!this.pIDS.includes(p2.id))
    //   this.pIDS[p2] = p2.id;
    // makes an object for a pair but does not save immediately 

    var pair = {
        id1: p2.id,
        id2: p1.id
      }

    // if there is more than one user waiting to be paird 
    if(allUsers.length >= 2){
      // make a pair of p1 and p2 
      this.pairs[p1] = pair.id2;
      this.pairs[p2] = pair.id1;
      // pop the two sockets off so that new people can be paired up
      //pairedQ.pop();
      //pairedQ.pop();
    }
   

    // this.
    // this.pairs[this.idx] = ''+pIDS[p1]+'#'+pIDS[p2]+'';// create a pair at the given index with the id's from pIDS
    
    // //this.pair = pairs[this.idx];// set the pair
    // this.idx++;// increment index so new pairs can be added

  },

  // gets the partner for a given person and return them
  get: function(pair) {
    //loop through the pairs array to find the pair we want
    for( var i = 0; i < this.pairs.length; i++){
      if(this.pairs[i] == pair){
        return this.pairs[i];
      }
    }

  },

  // remove the partner for both people by blanking out their partner 
  // potentiall can remove both 
  remove: function(person){
    var partner = this.pairs[person];
    // remove the partner 
    this.pairs[person] = '';
    // this.pairs[partner] = '';
    // put users back in the allUsers queue when they are removed 
    allUsers.push(person);
    //allUsers.push(partner);
    // find another partner for the partner should the remove function only be used on one socket 
    getPartner(partner);

  },

  // remove the partner for both people by blanking out their partner 
  // potentiall can remove both 
  removeBoth: function(person){
    var partner = this.pairs[person];
    // remove the partner 
    this.pairs[person] = '';
    this.pairs[partner] = '';
    // put users back in the allUsers queue when they are removed 
    allUsers.push(person);
    allUsers.push(partner);

  }

 };
 //function to check if stuff is in an array
 function includes(socket, arr){
    return arr.indexOf(socket) > -1;
 }
  // data is the array of all users, socket is the user
  // require this where people connect
  // at the moment where people connect message
  // or every time the window refreshes, the page is changed etc

  // what I want to do ******
  // build an object "pairs"
  // an object is a hashtable of sorts
  // key the object on each socket.id
  // have each socket.id have a value with a socket.id
  // one entry for each users, two entries for a pair
  // if you log on and there is osmeone else online
  // key their ids as the value for an object

     var chatRooms = new ChatTable();// makes the chatroom table thing
     exports.getPartner = function(socket) {
      var vm = this;
      //print out the allusers array
      for(var i = 0; i < allUsers.length; i++){
        if(i == 0){
          console.log('['+allUsers[i]+', ' );
        }else if(i == allUsers.length; i++){
          console.log(allUsers[i]+']');
        }
        console.log(allUsers[i]+', ');
      }
      // if the user already has a partner
      if(chatRooms.pairs.indexOf(socket) >= 0) {//chatRooms.pairs.includes(socket)){
        return chatRooms.pairs[socket];// return the person's partner
      }

      // pair two people from the allusers list
      // push them onto the all users list

      // if(!allUsers.indexOf(socket.id) >= 0) {//!allUsers.includes(socket.id)) {
      //   allUsers.push(socket.id);
      // }

      // if the socket you want to get a partner doesnt have one, give them one from the allUsers array
      // need to check and make sure that there's at least an even number of people in the chatroom to pair someone 
      if(!chatRooms.pairs.indexOf(socket) >= 0) {//!chatRooms.pairs.includes(socket.id) && (allUsers.length % 2 == 0)){
        var p2 = allUsers.indexOf(allUsers.length);// grabs a partner from all users connected waiting to chat
        chatRooms.put(socket, p2);// puts them to talk to eachother 
      }
     
      // original way of solving this pairing issue
      // var vm = this; 
      // if(!allUsers.includes(socket)) {
      //   allUsers.push(socket);//push the socket onto the all users, will get pulled off later
      // }
      // //just do nothing if the table is less than 2
      // if(allUsers.length >= 2) {
      //   var p2 = allUsers.pop();// get partner from allUsers
      //   chatRooms.put(socket,p2);// places people in correct place
      // }
      
     }

     exports.removePartner = function(socket) {
      var vm = this;
      if(chatRooms.pairs[socket] != null) {
        var prt = chatRooms.pairs[socket];
        chatRooms.pairs[socket] = '';// removes partner
        getPartner(chatRooms.pairs[prt]);
      }
      else {
        console.log("Error, no partner");
      }
     }


  // exports.getPartner = function(socket){
  //   var vm = this;
  //   if(!allUsers.includes(socket.id)){
  //       allUsers.push(socket.id);
  //       // odd # users case
  //       if(allUsers.length % 2 != 0){
  //          alert("Sorry there is not enough people to talk to, you have been added to a waiting list, try again soon!"); 
  //         }
  //       }else if(allUsers % 2 == 0){// even # users case 
  //         var person = allUsers.indexOf(allUsers.length);// get last person 
  //         var partner = { partner1: socket, partner2: person, chatting: true };
  //         vm.save(partner);
  //         // somehow notify the system to send messages only to other
  //       }
  //     }
  //     }

  // }

  // saves this socket
  // exports.saveSocket = function(socket){
  //   return socket;
  // }

  // exports.inQueue = function(socket){
  //   for(var i = 0; i < queue.length; i++){
  //     if(queue[i] === socket){
  //       console.log(socket+' is in the queue');
  //     }
  //   }
  // };
  
  // exports.findRoom = function(){
  //   var socket = saveSocket();
  //   if(rooms[socket.id] != null)
  //     return roomName = rooms[socket.id];
  //   return defaultRoom;
  // }
  // // function to print out the room that the current socket user is in
  // // primarily used to test if the user actually got placed in a room
  // exports.printRoomName = function(socket){
  //   var userRoom = rooms[socket.id];// get the room
  //   console.log(userRoom);
  //   socket.on(room).emit('You are in room: ' + userRoom);// emit this event to the room 
  // }

 

  // exports.pairLoneUsers = function(socket){
  //   // if the queue isnt empty
  //   if(queue.length > 1){
  //     var other = queue.shift(); // pops someone off of the queue if there is at least one user in it
  //     var room = socket.id+'#'+other.id; // makes a room based on the two id's of the users
  //     other.join(room); // makes the other person join the room
  //     socket.join(room); //puts the user into the room
  //     // register the rooms to their names
  //     rooms[other.id] = room;
  //     rooms[socket.id] = room;
  //     // emit the names of those within the chat to the chatroom 
  //     socket.to(room).emit('chat open', { 'name': uNames[socket.id], 'room': room } );
  //     socket.to(room).emit('chat open', { 'name': uNames[other.id], 'room': room } );
  //   }else{
  //     // if nobody is in the queue, add someone 
  //     // will be popped later to populate the place
  //     queue.push(socket);
  //     //inQueue(socket);
  //     //printRoomName(socket);
  //   }
  // };

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
  // var nonInterestedQ = [];// general queue for people with no interests
  // var maxUsers = 250;
  // var created = false;
  // exports.queueScheduler = function(socket){
  //   if(created == false){
  //     nonInterestedQ.push(socket.id);
  //   }
  //   created = true;
  // };

  // var tmp = [];
  // var queue = [];
  // // function to remove users from all queues they are a part of
  // // addition to the queue scheduler function 
  // exports.removeFromQueue = function(socket){
  //   queue = nonInterestedQ;
  //   // check every queue to see if the socket is present 
  //   for(i = 0; i < queue.length(); i++){
  //     tmp = queue[i];
  //       if(tmp[j] == socket.id){
  //         tmp.pop(socket.id);
  //       }
  //     tmp = [];// resets the tmp array 
  //     queue = []; // resets the queue array 
  //   }
  // };