var tripController = require('../controllers/tripController')

module.exports = function(socket) {
    socket.on('saveTrip', function(data) {
		tripController.saveTrip(data);
	});
};