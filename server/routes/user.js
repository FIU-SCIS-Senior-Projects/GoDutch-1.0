var passport = require('passport');
var control = require('../controllers/user');

module.exports = function (app) {
	app.route('/')
		.get(control.login);
	
	app.post('/', function(req,res){
		console.log(req.user);
		res.stats('login').send({user:req.user});
	});

	app.route('/signup')	
		.get(control.signup_render)				    
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
		.post(passport.authenticate('local', {
			successRedirect: '/success',						
			failureRedirect: '/login',
			failureFlash: true			
		}));
									
};
