var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var compression = require('compression');
var config = require('./config');
var flash = require('connect-flash');

module.exports = function(app){
	app.set('port', 8080);
	app.use(compression());
	app.use(bodyParser.urlencoded());
	app.use(bodyParser.json());
	app.use(session({
		saveUnitialized: true,
		resave: true,
		cookie: {maxAge: 300000},
		secret: config.sessionSecret
	}));
	
	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/../../app');
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	require('./../routes/user')(app);
};
