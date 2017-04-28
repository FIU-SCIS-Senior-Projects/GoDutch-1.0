'use strict';

angular.module('indexApp').controller('navbarCtrl', ['$location','$scope','$http','socket','storage', function($location, $scope, $http, socket,storage){
	// selectedTab = 'mytrip';
	$scope.template = { name: 'navbar.html', url: '/html/navbar.html'};
	$scope.newLogin = {}
	var keywords = ['home', 'mytrip', 'contact', 'about'];
	if($location.url()){
		console.log("URL HAS A PARAMETER" + $location.url());
		var param = $location.url().substring(1, $location.url().length);
		console.log("is url in keywords " + keywords.indexOf(param));
		if (keywords.indexOf(param) == -1){
			console.log("URI" + param);
			socket.emit('cipher', param);
			socket.on('decipher', function(data){
				console.log("PROFILE:" + data.profile);
				$scope.$parent.isLoggedIn = true;
				storage.put('token', data.token);
				$scope.$parent.profile = data.profile;
				var triplist = data.trips;
				socket.emit('joinTrip', {userid: $scope.$parent.profile.id, username: $scope.$parent.profile.username, tripid: $scope.$parent.profile.tripid});
			});
		}
	}

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
				console.log(res.data.token);
				console.log(res);
				if(res.data.token){
					$scope.$parent.isLoggedIn = true;
					storage.put('token', res.data.token);
					$scope.$parent.profile = res.data.profile;
					var triplist = res.data.trips;
					socket.emit('auth', res.data.token);
					$scope.$parent.trips.length = 0;
					for (var i = 0; i < triplist.length; i++) {
						$scope.$parent.trips.push(triplist[i]);
						socket.emit('joinroom', triplist[i].room, $scope.$parent.profile.username);
					}
				}
			},function(res){//failure
				console.log(res.data.error);
			}
		)
	}
	$scope.signout = function(){
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
