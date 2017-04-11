'use strict';

// creates the schema for partners 
// the boolean chatting makes sure that the two users are not paired forever 
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var PartnerSchema = new Schema({
	
	partner1: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	partner2: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	chatting: {
		type: Boolean,
		default: true
	}
});

mongoose.model('PartnerSchema', PartnerSchema);



