var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('./../config/config');
var userModel = mongoose.model('user');
var path = require("path");

var getErrorMessage = function (err) {
	var message = '';
		   
   	if (err.code) {	
		switch (err.code) {				
			case 11000:
				message = 'Username already exists';
				break;				
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

exports.success = function (req, res) {
	res.send('successful login' + req.token);
};

exports.homepage = function (req, res) {
	res.sendFile(path.resolve(__dirname + '/../../dist/public/index.html'));
};

exports.login = function (req, res) {
	if (!req.user) {
		res.send('you need to login');				    
	} else {		
		res.render('you are already signed in');								    
	}
};

exports.signup = function (req, res, next) {
	if (req.user) { //If the user is already signed in
	   	console.log('c');
	   	res.send('success');						
	} else {		
		var User = new userModel(req.body);
		console.log(User);
		User.provider = 'local';
		User.save(function (err) {
			if (err) { //If the creation of the new user didn't work
				res.status(401).json(getErrorMessage(err))
			}
		   	else {
				req.login(User, function (err) {
					if (err) return next(err);
					else {
						var profile = {
							username : User.username,
							email : User.email,
							id: User._id,
							trips: []
						}
				
						var token = jwt.sign(profile, config.jwtSecret, {expiresIn: config.expire});
						res.json({token: token, profile: profile});

					}						
				});					
			}				
		});			
	}
};

exports.createUser = function (req, res, next) {
   	var user = new User(req.body);
   	user.save(function (err) {
	   	if (err) {
		   	return next(err);
	   	} else {
		   	res.json(user);
		}
	});
};

exports.listUsers = function (req, res, next) {
   	user.find({}, 'username email id', function (err, users) {
	   	if (err) {
		   	return next(err);
	   	} else {
		   	res.json(users);
	   	}
   	});
};

exports.delete = function (req, res) {
   	user.remove({_id: req.params.userId}, function (err, user) {
	   	res.json(user);
   	});

};
exports.signout = function (req, res) {
   	res.json({token:''});
};
