'use strict';

angular.module('indexApp').controller('mainCtrl', ['$scope','$http','socket','storage', function($scope, $http,socket,storage){
 
	socket.isConnected(storage.get('token')).
	then(
		function(msg){
			console.log(msg);
			$scope.profile = msg.profile;
			var triplist = msg.trips;
			$scope.trips.length = 0;
			for (var i = 0; i < triplist.length; i++) {
				$scope.trips.push(triplist[i]);
				socket.emit('joinroom', triplist[i].room, $scope.profile.username);
			}
			$scope.isLoggedIn = true;
		},function(error){
			console.log(error);
			$scope.isLoggedIn = false;
		}
	);

	$scope.profile;
	$scope.trips = [];
}]);
