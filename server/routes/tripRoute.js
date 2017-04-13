var tripController = require('../controllers/tripController')
var mongoose = require('mongoose');
var userModel = mongoose.model('user');

module.exports = function (socket, io, clients, index) {

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