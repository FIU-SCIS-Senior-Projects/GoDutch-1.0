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
var io = require('socket.io')(server);

io.on('connection', function(client) {
	client.on('test', function(data) {
		console.log('data', data);
	});
});

server.listen(app.get('port'), function (){
	console.log('App started at ' + app.get('port'));
});
