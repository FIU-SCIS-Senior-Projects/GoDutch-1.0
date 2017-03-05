'use strict';

angular.module('indexApp').controller('navbarCtrl', ['$scope','$http','socket', function($scope, $http, socket){
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
		socket.emit('test', 'login request');
		$http.post('/signin', $scope.newLogin, config).
		then (
			function(res){//success
				if(res == 'success'){
					$scope.$parent.isLoggedIn = true;
					$scope.$parent.visibleLogin = false;			
					console.log(res);
				}
				$scope.$parent.isLoggedIn = true;
				$scope.$parent.visibleLogin = false;

			},function(res){//failure
				console.log(res);
			}
		)
	}
	$scope.signout = function(){
		console.log('button pressed');
		$http.post('/signout', '', config).
		then(
			function(res){
				if(res === 'success'){
					$scope.$parent.visibleLogin = true;
					console.log('u logged out');
				}
				console.log(res);
			},function(res){
				console.log(res)
		})
	}

	$scope.$parent.selectedTab = 'mytrip';

	$scope.set = function(tab) {
		$scope.$parent.selectedTab = tab;
		console.log($scope.$parent.selectedTab);
	}

	$scope.varify = function(tab) {
		return $scope.$parent.selectedTab === tab;
	}
/*	$scope.signup = function(){
		signupVisible = true;	
	};*/
}]);
