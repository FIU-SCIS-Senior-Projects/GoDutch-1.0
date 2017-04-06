var mongoose = require('mongoose');
var tripModel = mongoose.model('tripModel');
var path = require("path");
var mcmf = require("../services/mcmf");

var getErrorMessage = function (err) {
	var message = '';
		   
   	if (err.code) {	
		switch (err.code) {				
			case 11000:						
			case 11001:					
				message = 'Email already exists';					
				break;
			default:
				message = "Something went wrong";												
		}					    
	}		
	else {	
		for (var errName in err.errors) {		
			if (err.errors[errName].message) {										
				message = err.errors[errName].message;					
			}
		}
	}
	console.log(message);	
	return message;
};

exports.saveTrip = function(data) {
    var Trip = new tripModel(data);
	var promise = new Promise((resolve, reject) => {
		var update = {
			$set: {
				name: Trip.name, 
				purchasers: Trip.purchasers,
				items: Trip.items,
				consumers: Trip.consumers
			}
		}
		tripModel.findByIdAndUpdate(Trip.room, update, {new: true}, function(err, trip){
			if (err) {
				console.log(err.message);
				reject(err);
			}
			else {
				console.log('successfully saved trip');
				resolve(trip.room);
			}
		});
	});
	return promise;
}

exports.createTrip = function(data) {
    var Trip = new tripModel(data);
	var promise = new Promise((resolve, reject) => {
		Trip.save(function (err) {
			if (err) {
				console.log('error saving trip');
				console.log(err);
			}
			else {
				var _id = Trip.get("_id");
				tripModel.findByIdAndUpdate(_id, {$set: {room: _id}}, {new: true}, function(err, trip){
					if (err) reject(err);
					else {
						console.log('successfully created trip');
						resolve(trip.room);
					}
				});
			}
		});
	});
	return promise;
}

exports.deleteTrip = function(data) {
    // Need Implementation after trip is linked to user.
}

exports.calculate = function(data) {
	return mcmf.runMCMF(data);
}

exports.signup = function (req, res, next) {
	if (req.user) { //If the user is already signed in
	   	res.send('success');						
	} else {		
		var User = new user(req.body);
		User.provider = 'local';
		User.save(function (err) {
			if (err) { //If the creation of the new user didn't work
				res.send(err)
			}
		   	else {
				req.login(User, function (err) {
					if (err) return next(err);
					else {
						res.send('success');		
					}						
				});					
			}				
		});			
	}
};