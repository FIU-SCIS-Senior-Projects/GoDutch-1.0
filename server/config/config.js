//setup for mongoDB
var config = {
	port: 27017,
	db: 'mongodb://localhost/default',//replace default for db name
	host: 'zhenglinpw77470:8080',
	jwtSecret: 'devSechsecret',
	sessionSecret: 'devSech',
	expire: 60*60*24*60
};
module.exports = config;
