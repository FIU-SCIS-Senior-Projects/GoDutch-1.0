'use strict';

angular.module('indexApp').controller('homeCtrl', ['$scope', 'socket', function($scope, socket){
	$scope.template = { name: 'home.html', url: '/html/home.html'};
	$scope.name = 'john';
	$scope.message = 'heres whats been going on';
	$scope.show = function(){
		return $scope.$parent.selectedTab === 'home'
	}
}]);
