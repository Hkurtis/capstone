'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MessageSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String
  },
  message: {
    type: String,
    default: ''
  },
  room: {
    type: String
  }
});

mongoose.model('Message', MessageSchema);
