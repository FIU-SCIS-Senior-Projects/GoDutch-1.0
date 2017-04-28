'use strict';

angular.module('indexApp').controller('contactCtrl', ['$scope', 'socket', function($scope, socket){
	$scope.template = { name: 'contact.html', url: '/html/contact.html'};
	$scope.message = {}
	$scope.show = function(){
		return $scope.$parent.selectedTab === 'contact'
	}

	$scope.isEmpty = function(data){
		return data == '' || data == undefined || data == null;
	}

	$scope.send = function(){
		console.log($scope.message);
		socket.emit('sendEmail', $scope.message);
	}
}]);
