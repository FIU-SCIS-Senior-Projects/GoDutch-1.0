var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = new mongoose.Schema({
	username: {
		 type: String,
		 required: [true, 'Need a Username'],
		 unique: [true, 'Username already exists'],
		 lowercase: true,
		 trim: true
	 },
	 password: {
		 type: String,
		 required: [true, 'Need a password']
	 },
	 role: String,
	 email: {
		 type: String,
		 unique: [true, 'E-mail already exists'],
		 required: [true, 'Need an Email'],
		 lowercase: true,
		 trim: true
	 },
	 salt: {
		 type: String
	 },
	 provider: {
	 	type: String,
		required: [true, 'Provider is required']
	 }
	
});

Schema.pre('save', function (next) {
	    if (this.password) {
			        this.salt = new
	            Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        console.log('before encrypt ' + this.password + ' AFTER ' + this.hashPassword(this.password));
		this.password = this.hashPassword(this.password);
		    }
		    next();
});
Schema.methods.hashPassword = function (password) {
	    //return crypto.pbkdf2Sync(password, this.salt, 10000,
		//		        64).digest('hex').toString('base64');
		var hash = crypto.createHmac('sha512', this.salt)
		hash.update(password)
		return hash.digest('base64')
};
Schema.methods.authenticate = function (password) {
		//console.log(password + ' HASH ' + password);   
   		return this.password === this.hashPassword(password);
};

Schema.set('toJSON', {
	    getters: true,
	    virtuals: true
});


mongoose.model('user', Schema);
