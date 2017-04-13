'use strict';

angular.module('indexApp').controller('navbarCtrl', ['$scope','$http','socket','storage', function($scope, $http, socket,storage){
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
			function(res){//success
				socket.emit('invite', {email: 'jbelt021@fiu.edu',
					id: 123
				});
				socket.on('successEmail', function(data){
					console.log('EMAIL SUCCRESS');
					console.log(data);
				})
				socket.on('emailError', function(err){
					console.log(err);
					console.log('ERROR SENDING EMAIL');
				});
				console.log(res.data.token);
				console.log(res);
				if(res.data.token){
					$scope.$parent.isLoggedIn = true;
					storage.put('token', res.data.token);
					console.log(res.data.token);
					$scope.$parent.profile = res.data.profile;
				}
			},function(res){//failure
				console.log(res.data.error);
			}
		)
	}
	$scope.signout = function(){
		console.log('button pressed');
		$http.post('/signout', '', config).
		then(
			function(res){
				$scope.$parent.isLoggedIn = false;
				storage.put('token',res.data.token);
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
