'use strict';

app.factory('socket', function ($q) {  
	var socket = io.connect();
	return {
		on: function (eventName, callback) {
			socket.on(eventName, callback);
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, callback);
		},
		connect: function(token){
			console.log('TOKEN ATTEMPTING TO CONNECT', token);
			socket.emit('auth', token);
			return true;
		},
		isConnected: function(token){
			var deferred = $q.defer();
			console.log(token);
			socket.emit('auth', token).on('Error', function(error){
				deferred.reject(error);
			}).on('success', function(msg){
				deferred.resolve(msg);
			});
			return deferred.promise;
		}
	};
});
