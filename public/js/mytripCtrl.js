'use strict';

angular.module('indexApp').controller('mytripCtrl', ['$scope', function($scope){
		console.log($scope);
		// $scope.signupVisible = ($scope.selectedTab==='mytrip');
		$scope.template = { name: 'mytrip.html', url: '/html/mytrip.html'};
}]);
