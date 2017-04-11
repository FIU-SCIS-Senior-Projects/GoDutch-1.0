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

io.sockets.on('connection', function(socket) {
//	console.log(socket.decoded_token.email);
	require('./server/routes/tripRoute')(socket, io);

	socket.on('auth', function(data){
		jwtDecode.verify(data, config.jwtSecret, function(err, decoded){
			if(err){
				socket.emit('Error', {'name': err.name, 'message': err.message});
			}
			else{
				socket.decoded_token = decoded;
				socket.emit('success', decoded);
			}
		});
	});
	socket.on('test', function(data) {
		console.log('data', data);
	});

	socket.on('isLogged', function(data){
		console.log(data);
		io.emit('logged', {logged: true});
	})

	socket.on('username', function() {
		console.log("server: ", socket.decoded_token);
		io.emit('usernameSuccess', socket.decoded_token);
	})
	
    socket.on('room', function(room) {
		if (io.sockets.adapter.sids[socket.id][room]) {
			console.log(room, 'in');
			io.in(room).emit('message', {data: 'you are already in'});
		} else {
        	socket.join(room);
			console.log(room, 'out');
			io.in(room).emit('message', {data: 'join room'});
		}
    });
});

server.listen(app.get('port'), function (){
	console.log('App started at ' + app.get('port'));
});
