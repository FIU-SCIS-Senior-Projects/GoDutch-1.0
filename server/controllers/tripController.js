var mongoose = require('mongoose');
var tripModel = mongoose.model('tripModel');
var path = require("path");

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
    Trip.save(function (err) {
        if (err) {
            console.log(err);
            console.log('========================================================================================================');
            console.log(data);
            console.log('error saving trip');
        }
        else {
            console.log('successfully saved trip');
        }				
    });
}

exports.signup = function (req, res, next) {
	if (req.user) { //If the user is already signed in
	   	console.log('c');
	   	res.send('success');						
	} else {		
		var User = new user(req.body);
		console.log(User)		
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