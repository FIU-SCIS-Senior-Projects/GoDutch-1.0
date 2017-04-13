var tripController = require('../controllers/tripController')
var mongoose = require('mongoose');
var userModel = mongoose.model('user');
var email = require('../config/emailConfig'); 
var nodemailer = require('nodemailer');
var crypto = require('crypto'),
	algorithm = 'aes-256-ctr';

module.exports = function (socket, io, clients, index) {

	socket.on('invite', function(data){
		var options = email();
		var transporter = nodemailer.createTransport({
			service: options.service,
			host: "smtp.gmail.com",
			port:25,
			secure: false,
			auth: {
				user: options.user,
				pass: options.pass
			}
		});
		var query = userModel.findOne({email:data.email});
		var mailOptions = {
			from: options.user,
			to: data.email,
			subject: 'Welcome to GoDutch!'
		};
		query.exec(function (err, user){
			if(user){
				var cipher = crypto.createCipher(algorithm, options.secret);
				var link = cipher.update(data.email + ' ' + data.id.toString(),'utf8','base64');
				link += cipher.final('base64');
				mailOptions.text = 'http://192.168.56.100/j/' + link.toString("utf-8");
				console.log('transporter going here');
				transporter.sendMail(mailOptions, function(error,info){
					console.log('FINALLY HERE');
					if(error){
						console.log('HERE');
						socket.emit('emailError', error);
					}else{
						console.log('HERE 2');
						socket.emit('successEmail', info.response);
					}
				});
			}
			else{
				console.log('HERE 3');
				var newUser = {
					username: data.email,
					email: data.email,
					password: data.email,
					provider: 'local'
				}
				var User = new userModel(newUser);
				User.save(function(err){
					console.log(User, err);	
					if(err){
						socket.emit('Error', err);
					}
					else{
						var hash = crypto.createHmac('sha512', User.salt);
						var link = hash.update(data.id.toString())
						mailOptions.text = link;
						transporter.sendMail(mailOptions, function(error,info){
							if(error){
								socket.emit('emailError', err);
							}else{
								socket.emit('successEmail', info.response);
							}
						});
					}
				});
			}
		});
		transporter.close();
	});
	socket.on('saveTrip', function (data) {
		tripController.saveTrip(data).then(
			function(room) {
				socket.emit('saveSuccess', {data: room});
				io.in(room).emit('update', 'changes were made to room');
			},
			function(error) {
				socket.emit('saveFailure', {data: error});
			}
		);
	});

	socket.on('createTrip', function (trip) {
		tripController.createTrip(trip).then(
			function(room) {
				socket.emit('saveSuccess', room);
				console.log("here: ", room);
				userModel.findByIdAndUpdate(socket.decoded_token.id, {
					$push: {
						triplist: {
							$each: [room],
							$position: 0
						}
					}
				}, {new: true}, function(err, user){
					if (err) console.log(err.message);
					else {
						socket.emit('joinTripSuccess', room);
						console.log('successfully created trip');
					}
				});
			},
			function(error) {
				socket.emit('joinTripFailure', error);
			}
		);
	});

	socket.on('joinTrip', function(object) {
		var userid = object.userid, username = object.username, tripid = object.tripid;
		console.log('userid: ', userid, 'tripid: ', tripid);
		tripController.appendConsumer(userid, username, tripid)
		.then(
			function() {
				tripController.joinTrip(userid, tripid).then(
					function(room) {
						socket.emit('joinTripSuccess', room);
					},
					function(error) {
						socket.emit('joinTripFailure', error);
					}
				);
			},
			function(error) {
				socket.emit('joinTripFailure', error);
			}
		);
	});

	socket.on('loadTrip', function(userid) {
		tripController.loadTrip(userid).then(
			function(triplist) {
				socket.emit('loadTripSuccess', triplist);
			},
			function(error) {
				socket.emit('loadTripFailure', error);
			}
		);
	});

	socket.on('deleteTrip', function (data) {
		tripController.deleteTrip(data);
	});

	socket.on('calculate', function (data) {
		var result = tripController.calculate(data);
		socket.emit('result', result);
	});
};
