var emailConfig = {
	service: 'gmail',
	user: 'example@fiu.edu',
	pass: 'password',
	secret: 'itsasecret'
}

module.exports = function(transport, mailer){
	
	return emailConfig;
};
