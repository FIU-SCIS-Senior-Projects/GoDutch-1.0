'use strict';

angular.module('indexApp').controller('navbarCtrl', ['$scope','$http', 'navigation', function($scope, $http,navigation){
	// selectedTab = 'mytrip';
	$scope.template = { name: 'navbar.html', url: '/html/navbar.html'};
	$scope.newLogin = {}
	var config = {
		headers : {		
			'Content-Type': 'application/json'
		}			              
	}
	$scope.isEmpty = function(data){
		return data == '' || data == undefined || data == null;
	}
	$scope.signin = function(){
		$http.post('/signin', $scope.newLogin, config).
		then (
			function(res){
				console.log(res);
			},function(res){
				console.log(res);
			}
		)
	
	}
/*	$scope.signup = function(){
		signupVisible = true;	
	};*/
}]);
