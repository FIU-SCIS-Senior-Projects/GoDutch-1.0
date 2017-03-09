var http = require('http')
var fs = require('fs');

var mongoose = require('mongoose')
var root = __dirname;

var config = require('./server/config/config');
require('./server/config/db')(config);

var passport = require('passport');
require('./server/config/passport')(passport);

var express = require('express');
var app = express();
require('./server/config/index')(app);

var modelsPath = root + '/server/models';
fs.readdirSync(modelsPath).forEach(function(file) {
	if (file.indexOf('.js') >= 0){
		require(modelsPath + '/'+ file);
	}
});

app.use(express.static(__dirname + '/dist/public'));

var server = http.createServer(app)
var sio = require('socketio-jwt');
var io = require('socket.io')(server);

io.use(sio.authorize({
	  secret: config.jwtSecret,
	  handshake: true
}));

io.sockets.on('connection', function(socket) {
	console.log(socket.decoded_token.email);
	io.emit('success', {data: 'welcome'});
	require('./server/routes/tripRoute')(socket);
	socket.on('test', function(data) {
		console.log('data', data);
	});
	socket.on('isLogged', function(data){
		console.log(data);
		io.emit('logged', {logged: true});
	})
    socket.on('room', function(room) {
		if (io.sockets.adapter.sids[socket.id][room]) {
			console.log(room, 'in');
			room = "random";
			io.in(room).emit('message', {data: 'you are already in'});
		} else {
        	socket.join(room);
			console.log(room, 'out');
			room = "random";
			io.in(room).emit('message', {data: 'join room'});
		}
    });
});

server.listen(app.get('port'), function (){
	console.log('App started at ' + app.get('port'));
});
