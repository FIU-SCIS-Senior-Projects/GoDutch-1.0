var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('user');

module.exports = function(){
	passport.use(new LocalStrategy(function(username, password, done){
		/*
		 * This query will search through the database, through the user
		 * schema for a username which matches the 'username' field.
		 *
		 * Afterwards it will check if the hashed stored password matches
		 * the one which was entered
		 */
		var query = User.findOne({'email': username});

		query.exec(function (err,user){
			if (err){
				return done(err);
			}
			if(!user){
				return done(null, false, {message: 'Unknown User'})
			}
			if(!user.authenticate(password)){//method in User model
				return done(null, false, {message: 'Invalid Login'})
			}
			return done(null, user)
		})
	}))
}
