'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var server = app.start();

// //delete all below
// //new
// var io = require("socket.io");
// var socket = io.listen(8000,"1.2.3.4");
// var Room = require('./room.js');

// var rooms = {};
// var people = {};//people in a given chat room
// var clients = [];//clients total


// function Room(name, id){
// 	this.name = name;
// 	this.id = id;
// 	this.people = [];
// 	this.status = "available";
// };

// //allows for a person to be added to a room
// Room.prototype.addPerson = function(personId){
// 	if(this.status === "available")
// 			this.people.push(personId);
// };

// module.exports = Room;