var tripController = require('../controllers/tripController')
var mongoose = require('mongoose');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var userModel = mongoose.model('user');
var emailConfig = require('../config/emailConfig');
var config = require('../config/config');
var nodemailer = require('nodemailer');
var crypto = require('crypto'),
	algorithm = 'aes-256-ctr';

module.exports = function (socket, io, clients, index) {
	var CI = function(cipher, text){
		var link = cipher.update(text, 'utf8', 'base64');
		link += cipher.final('base64');
		return link;
	};
	var DI = function(decipher, encrypt){
		var text = decipher.update(encrypt, 'base64', 'utf8');
		text += decipher.final('utf8');
		return text;
	};
	socket.on('cipher', function(link){
		var request = decodeURI(link);
		var options = emailConfig;
		var decipher = crypto.createDecipher(algorithm, options.secret );
		var parts = request.split('_');
		var email = DI(decipher, parts[0]);

		decipher = crypto.createDecipher(algorithm, options.secret);

		var trip_id = DI(decipher, parts[1]);

		var query = userModel.findOne({email:email});
		query.populate('triplist')
		.exec(function (err, user) {
			if (err) socket.emit('cipherError', err);
			if(user){
			console.log(user.triplist);
			var profile = {
				username: user.username,
				email: user.email,
				id: user._id,
				tripid: trip_id
			};

			var trips = user.triplist;
			var token = jwt.sign(profile, config.jwtSecret, { expiresIn: config.expire });
			socket.emit('decipher', {profile:profile, trips:trips, token:token});
			}else{
				User = new userModel({username: email, email:email, password: email, provider: 'local'});
				User.save(function(error){
					if(error){
						console.log('fuck');
					}
					else{
						console.log('yeah');
					}
				});
			}
		});
	});

	socket.on('invite', function(data){
		var options = emailConfig;
		console.log(options);
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
				if (user.triplist.indexOf(data.id) == -1) {
					console.log('data trying to cipher:' + data.id.toString('utf-8'));
					var cipher = crypto.createCipher(algorithm,options.secret);
					var link1 = CI(cipher, data.email);
					cipher = crypto.createCipher(algorithm,options.secret);
					var link2 = CI(cipher, data.id.toString('utf-8'));
					var link = encodeURI(link1 + "_" + link2).toString('utf-8');;
					var emailLink = 'http://' + config.host + '/#' + link;

					fs.readFile(__dirname + '/resources/email.html', 'utf8', function(err, html){
						var res = html.replace('$USER1', 'Jonathan Beltran');
						res = res.replace('$LINK', emailLink);
						res = res.replace('$LINK', emailLink);
						mailOptions.html = res;
						transporter.sendMail(mailOptions, function(error,info){
							if(error){
								socket.emit('emailError', error);
							}else{
								socket.emit('successEmail', info.response);
							}
						});

					});
				} else {
					console.log('Error: ' + user.username + ' is already in trip ' + data.id);
				}
			}
			else{
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
					}else{
						console.log('data trying to cipher:' + data.id.toString('utf-8'));
						var cipher = crypto.createCipher(algorithm,options.secret);
						var link1 = CI(cipher, data.email);
						cipher = crypto.createCipher(algorithm, options.secret);
						var link2 = CI(cipher, data.id.toString('utf-8'));
						var link = encodeURI(link1 + "_" + link2).toString('utf-8');
						emailLink = 'http://' + config.host + '/#' + link;
						fs.readFile(__dirname + '/resources/email.html', 'utf8', function(err, html){
							var res = html.replace('$USER1', 'Jonathan Beltran');
							res = res.replace('$LINK', emailLink);
							mailOptions.html = res;
							transporter.sendMail(mailOptions, function(error,info){
								if(error){
									socket.emit('emailError', error);
								}else{
									socket.emit('successEmail', info.response);
								}
							});
						});
					}
				});
			}
		transporter.close();
	});
});
	socket.on('saveTrip', function (data) {
		tripController.saveTrip(data).then(
			function(room) {
				socket.emit('saveSuccess', {data: room});
				io.in(room).emit('update', 'changes were made to room: ' + room);
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
		var tripExist = false;
		tripController.loadTrip(userid).then(
				function(triplist){
					for (var i = 0; i < triplist.length; i++){
							if(triplist[i].room == tripid){
								tripExist = true;
							}
					}
					if(!tripExist){
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
					}
				},
				function(error){
					console.log(error)
				}
		)

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
