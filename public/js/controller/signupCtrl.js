'use strict';

angular.module('indexApp').controller('signupCtrl', ['$scope','$http','socket', function($scope, $http, socket){
//    $scope.signupVisible = false;
	socket.emit('test', 'Hello World');
	$scope.User = {};
	$scope.template = { name: 'signup.html', url: '/html/signup.html'};
	var config = {
		headers : {		
			'Content-Type': 'application/json'
		}			              
	}
	$scope.register = function() {
		if ($scope.User.password != $scope.User.repassword){
			console.log('password mismatch')
		}
		else{
			console.log($scope.User);
			$http.post('/signup', $scope.User, config).
			then(
				function(response){
					$scope.$parent.isLoggedIn = true;				
					// success callback        
					console.log(response)
				},        
				function(response){				
					//                        // failure callback
					console.log(response) 		
				}
			);
		}
	}
}]);
