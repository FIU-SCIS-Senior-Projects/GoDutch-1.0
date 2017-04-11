'use strict';

angular.module('indexApp').controller('mainCtrl', ['$scope','$http','socket','storage', function($scope, $http,socket,storage){
 
	socket.isConnected(storage.get('token')).
	then(
		function(msg){
			console.log(msg);
			$scope.profile = msg;
			$scope.isLoggedIn = true;
		},function(error){
			console.log(error);
			$scope.isLoggedIn = false;
		}
	);

	$scope.profile;
}]);
