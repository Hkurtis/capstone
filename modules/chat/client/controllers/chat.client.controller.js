(function () {
  'use strict';

  angular
    .module('chat')
    .controller('ChatController', ChatController);

  ChatController.$inject = ['$scope', '$state', 'Authentication', 'Socket'];
  var connectedUsers = {};
  var connectedSockets = {};
  var chattingUsers = {};
  function ChatController($scope, $state, Authentication, Socket) {
    var vm = this;

    vm.messages = [];
    vm.messageText = '';
    vm.sendMessage = sendMessage;

    vm.user = user;//maybe this will work? grabs the username of the user that logs in

    init();

    function init() {
      connectedUsers[user] = socket.id;//stores the socket of the connected user into the connected users array
      connectedSockets[socket.id] = {user: user, socket: socket };//stores the users socket into the socket array
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

    socket.emit('join',room);


    // client.on("createRoom", function(name){
    //   if(people[client.id].room === null){
    //     var id = uuid.v4();
    //   }

    // });
    // io.on("connection",function(client){
    //   client.on("join",function(name){
    //     roomID = null;
    //     people[client.id] = {"name" : name, "room" : room};
    //     client.emit("update", "You have connected");
    //     socket.sockets.emit("")
    //     socket.sockets.emit("update-people", people);
    //   })


    // });
    //model for chat messages to get stored...?
   // var Chat = mongoose.model("Message", chatSchema);

    //here is where I want users to be able to join and leave rooms 
    //on connecting I want to add them to a list of connected users based on their socket id
    //I then want to add sockets to a list of possible sockets that would be used to populate a room
    //2 users per room
    io.on('connection', function(socket)){
      //as a user connects add to the list of connected users
      //this allows the user to specify where they are going to join a room
      //need to link this up to a button where the user can choose a topic so it will join the right room
      socket.on('join',function(roomData){
        connectedUsers[socket.id] = roomData.userId;//puts person nto connected users array
        if(connectedUsers.length() >= 2){
          //if there are more than two users dont let them connect
        }else{//if there are less than two users in a roomroom
        socket.join(roomData.roomName);//join the specific room
        chattingUsers[socket.id] = connectedUsers[socket.id];//remove them from the list if they join a room to chatting list
        connectedUsers[socket.id] = null;//sets the space to be nothing now 
      }
      });
      //this allows users to leave rooms
      socket.on('leave',function(roomData){
        chattingUsers[socket.id] = null;//remove the mfrom the chatting list if they leave a room
        socket.leave(roomData.roomName);//leave the specific room
      })

    };

    //this function is designed to check and see if there are any users connected
    function usersConnected(){
      if(connectedUsers.length <1){
        return false;
      }else{
        return true;
      }
    };

    // Create a controller method for sending messages
    function sendMessage() {
      // Create a new message object
      var message = {
        text: vm.messageText,
        user: vm.username//user portion of the message object #added on along w/ messageText
      };

      // message.save(function(err,mssg){
      //   io.in(mssg.room).emit('message created',mssg);
      // });
      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);


    //saving to database 
   
    //var msg = new Chat({msg: message});
    message.save(function(err){
      if(err){//if an error is present throw it 
        throw err;
      }else{//else save the message to the database
      Socket.emit('get message',message);
      }

   });

      // Clear the message text
      vm.messageText = '';
    }
  }
}());
