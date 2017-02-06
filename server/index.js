'use strict';

var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	path = require('path'),
	script = require('../public/js/script');

app.use(express.static(__dirname + '/../dist/public'));

app.get('/', function(req, res){
  	res.sendFile(path.resolve(__dirname + '/../dist/public/index.html'));
});

http.listen(3000, function(){
  	console.log('API running on http://localhost:3000/');
});