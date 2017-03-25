'use strict';

angular.module('indexApp').controller('mainCtrl', ['$scope','$http','socket','storage', function($scope, $http,socket,storage){
	//$scope.isLoggedIn = socket.isConnected(storage.get('token')); 
	socket.isConnected(storage.get('token')).
	then(
		function(msg){
			$scope.isLoggedIn = true;
			$scope.selectedTab = storage.get('tab');
			return true;
		},function(error){
			$scope.isLoggedIn = false;
			return true;
		}
	);
	
}]);
