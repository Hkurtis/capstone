// socket.on('catalogueusers', function(room){
//   //array of users belonging to room
//   var roomUsers = [];

//   //form list of users in room
//   for (var i = 0; i < io.users.length; i++) {
//     var user = io.users[i];
//     if (user.room === room) {
//       roomUsers.push(user);
//     }
//   }

//   //match users from room
//   matchUsers(roomUsers, room);
// });

// socket.on('matchUsers', function(roomUsers, room){
//   for (var i = 0; i < roomUsers.length; i+=2) {
//     if ((roomUsers.length-i)/2 >0){//if there are at least two users in room

//       //create new room for two people
//       var newRoom = room+''+io.rooms.length;
//       socket.create(newRoom);

//       //switch people into new rooms
//       var data = {
//         newRoom: newRoom,
//         oldRoom: room
//       };
//       roomUsers[i].emit('switchroom', data);
//       //roomUsers[i].emit('updaterooms', rooms, newRoom);
//       roomUsers[1+i].emit('switchroom', data);
//       //roomUsers[1+i]emit('updaterooms', rooms, newRoom);
//     }
//   }
// });
