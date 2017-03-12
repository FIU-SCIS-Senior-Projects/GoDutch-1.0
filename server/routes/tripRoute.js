var tripController = require('../controllers/tripController')

module.exports = function (socket) {
	socket.on('saveTrip', function (data) {
		tripController.saveTrip(data);
	});

	socket.on('deleteTrip', function (data) {
		tripController.deleteTrip(data);
	});

	socket.on('calculate', function (data) {
		var result = tripController.calculate(data);
		socket.emit('result', result);
	});
};