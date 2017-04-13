var passport = require('passport');
var control = require('../controllers/user');
var jwt = require('jsonwebtoken');
var config = require('./../config/config.js');
var mongoose = require('mongoose');
var userModel = mongoose.model('user');
module.exports = function (app) {
	app.route('/')
		.get(control.homepage);

	app.post('/', function (req, res) {
		console.log(req.user);
		res.stats('login').send({ user: req.user });
	});
	app.route('/j/*')
		.get(control.joinTrip);
	app.route('/signup')
		.post(control.signup);

	app.route('/success')
		.get(control.success);
	app.route('/signout')
		.post(control.signout);

   	app.route('/login')
		.get(control.login);

	//app.post('/login', function (req, res) {
	//	console.log(req.user);									    
	//	res.status('login').send({user: req.user});							
	//});

	//   	app.route('/users')
	//		.get(control.listUsers);

	app.route('/signin')
		.post(function (req, res, next) {
			passport.authenticate('local', function (err, user, info) {
				if (err) { return next(err) }
				if (!user) { return res.json(401, { error: 'Unsuccessful Login' }) }
				userModel.findById(user._id)
					.populate('triplist') 
					.exec(function (err, user) {
						if (err) return handleError(err);
						console.log(user.triplist);
						var profile = {
							username: user.username,
							email: user.email,
							id: user._id,
						};
						var trips = user.triplist;

						var token = jwt.sign(profile, config.jwtSecret, { expiresIn: config.expire });
						res.json({ token: token, profile: profile, trips: trips });
					});

			})(req, res, next);
		});

};
