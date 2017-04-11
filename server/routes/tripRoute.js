var tripController = require('../controllers/tripController')
var mongoose = require('mongoose');
var userModel = mongoose.model('user');
var 

module.exports = function (socket, io) {

	socket.on('invite', function(data){
		var newUser = {
			username: data.email,
			email: data.email,
			password: data.email,
			provider: 'local'
		}
		var User = new userModel(newUser);
		User.save(function(err){	
			if(err){
				socket.emit('Error', err);
			}
			else{
				salt = User.salt
				tripID = data.id
				var hash = crypto.createHmac('sha512', this.salt);
				hash.update(tripID)
				
			}
		});
	});
	socket.on('saveTrip', function (data) {
		tripController.saveTrip(data).then(
			function(room) {
				io.sockets.emit('saveSuccess', room);
			},
			function(error) {
				io.sockets.emit('saveFailure', error);
			}
		);
	});

	socket.on('createTrip', function (data) {
		tripController.createTrip(data).then(
			function(room) {
				io.sockets.emit('saveSuccess', room);
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
					else 
						console.log('successfully created trip');
				});
			},
			function(error) {
				io.sockets.emit('saveFailure', error);
			}
		);
	});

	socket.on('deleteTrip', function (data) {
		tripController.deleteTrip(data);
	});

	socket.on('calculate', function (data) {
		var result = tripController.calculate(data);
		io.sockets.emit('result', result);
	});
};
