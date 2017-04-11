'use strict';

app.factory('socket', function ($q) {  
	var socket;
	return {
		on: function (eventName, callback) {
			socket.on(eventName, callback);
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, callback);
		},
		connect: function(token){
			console.log('TOKEN ATTEMPTING TO CONNECT', token);
			socket = io.connect('', {
				'query' : 'token=' + token
			}).on('success',function(msg){
				console.log(msg);
			});
		},
		isConnected: function(token){
			var deferred = $q.defer();
			socket = io.connect('', {
				'query': 'token=' + token
			}).on('error', function(error){
				deferred.reject(error);
			}).on('success', function(msg){
				deferred.resolve(msg);
			});
			return deferred.promise;
		}
	};
});
