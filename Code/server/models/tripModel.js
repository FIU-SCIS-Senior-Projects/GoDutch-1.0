var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = new mongoose.Schema({
     name: {
		 type: String,
		 required: [true, 'Need a trip name'],
		 trim: true
     },
     room: {
         type: String,
         unique: true
     },
     purchasers: [{
         name: String 
     }],
     items: [{
        name: String,
        purchasers: [{
            name: String 
        }],
        payments: [],
        consumers: [{
            name: String 
        }]
     }],
     consumers: [{
         name: String 
     }]
});

Schema.set('toJSON', {
	getters: true,
	virtuals: true
});

mongoose.model('tripModel', Schema);
