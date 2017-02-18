//setup for mongoDB
var config = {
	port: 27017,
	db: 'mongodb://localhost/default',//replace default for db name
	host: 'localhost',
	sessionSecret: 'devSechsecret'
};
module.exports = config;
