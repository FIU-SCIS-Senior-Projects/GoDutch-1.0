'use strict';

angular.module('indexApp').controller('signupCtrl', ['$scope','$http','socket','storage', function($scope, $http, socket,storage){
//    $scope.signupVisible = false;
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
			$http.post('/signup', $scope.User, config).
			then(
				function(response){
					$scope.$parent.isLoggedIn = true;
					socket.connect(response.data.token);
					storage.put("token", response.data.token);
				},        
				function(response){				
					//                        // failure callback
					console.log(response) 		
				}
			);
		}
	}
}]);
