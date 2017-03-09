var passport = require('passport');
var control = require('../controllers/user');
var jwt = require('jsonwebtoken');
var config = require('./../config/config.js');
module.exports = function (app) {
	app.route('/')
		.get(control.homepage);
	
	app.post('/', function(req,res){
		console.log(req.user);
		res.stats('login').send({user:req.user});
	});

	app.route('/signup')				    
		.post(control.signup);

	app.route('/success')
		.get(control.success);

   
   	app.route('/login')
		.get(control.login);
					
	//app.post('/login', function (req, res) {
	//	console.log(req.user);									    
	//	res.status('login').send({user: req.user});							
	//});
		   
//   	app.route('/users')
//		.get(control.listUsers);
								
	app.route('/signin')
		.post(function (req,res,next){
			if(req.user){
				res.json({message: 'already logged in'});
			}
			passport.authenticate('local', function(err,user,info){
				if(err) {return next(err)}
				if(!user) {return res.json(401,{error: 'Unsuccessful Login'})}
				var profile = {
					username : user.username,
					email : user.email,
					id: user._id
				}
				
				var token = jwt.sign(profile, config.jwtSecret, {expiresIn: 60*60*5});
				res.json({token: token});
			})(req, res, next);
		});
									
};
