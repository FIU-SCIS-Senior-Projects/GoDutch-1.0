'use strict';

angular.module('indexApp').controller('mainCtrl', ['$scope','$http','socket', function($scope, $http,socket){
 
	socket.isConnected(localStorage.getItem("token") || 'fake').
	then(
		function(msg){
			$scope.isLoggedIn = true;
			$scope.visibleLogin = false;
		},function(error){
			$scope.isLoggedIn = false;
			$scope.visibleLogin = true;
		}
	);
}]);
