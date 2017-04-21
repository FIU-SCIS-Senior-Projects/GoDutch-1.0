var http = require('http')
var fs = require('fs');
var jwtDecode = require('jsonwebtoken');

var mongoose = require('mongoose')
var root = __dirname;
var modelsPath = root + '/server/models';
fs.readdirSync(modelsPath).forEach(function(file) {
	if (file.indexOf('.js') >= 0){
		require(modelsPath + '/'+ file);
	}
});
var tripController = require('./server/controllers/tripController')
var userModel = mongoose.model('user');

var config = require('./server/config/config');
require('./server/config/db')(config);

var passport = require('passport');
require('./server/config/passport')(passport);

var express = require('express');
var app = express();
require('./server/config/index')(app);


app.use(express.static(__dirname + '/dist/public'));

var server = http.createServer(app);
var io = require('socket.io')(server);
var userModel = mongoose.model('user');

io.sockets.on('connection', function(socket) {
	require('./server/routes/tripRoute')(socket, io);

	socket.on('auth', function(data){
		jwtDecode.verify(data, config.jwtSecret, function(err, decoded){
			if(err){
				socket.emit('Error', {'name': err.name, 'message': err.message});
			}
			else{
				socket.decoded_token = decoded;
				userModel.findById(decoded.id)
					.populate('triplist') 
					.exec(function (err, user) {
						if (err) return handleError(err);
						if (user) {
						var profile = {
							username: decoded.username,
							email: decoded.email,
							id: decoded.id,
						};
						console.log('from auth route' + user)
						var trips = user.triplist;
						console.log('auth requested');
						socket.emit('success', { profile: profile, trips: trips} );
						}
					});
			}
		});
	});
	socket.on('test', function(data) {
		console.log('data', data);
	});

	socket.on('isLogged', function(data){
		io.emit('logged', {logged: true});
	})

	socket.on('username', function() {
		io.emit('usernameSuccess', socket.decoded_token);
	})
	
    socket.on('joinroom', function(room, username) {
		if (io.sockets.adapter.sids[socket.id][room]) {
			io.in(room).emit('message', {data: username + ' has already been in the room'});
		} else {
        	socket.join(room);
			io.in(room).emit('message', {data: username + ' joined the room'});
		}
    });
});

server.listen(app.get('port'), function (){
	console.log('App started at ' + app.get('port'));
});
