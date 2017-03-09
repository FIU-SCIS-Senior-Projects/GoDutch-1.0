'use strict';

angular.module('indexApp').controller('mainCtrl', ['$scope','$http','socket','storage', function($scope, $http,socket,storage){
 
	socket.isConnected(storage.get('token')).
	then(
		function(msg){
			$scope.isLoggedIn = true;
		},function(error){
			$scope.isLoggedIn = false;
		}
	);
}]);
