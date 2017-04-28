'use strict';

angular.module('indexApp').controller('homeCtrl', ['$scope', 'socket', function($scope, socket){
	$scope.template = { name: 'home.html', url: '/html/home.html'};
	$scope.message = {}
	$scope.show = function(){
		return $scope.$parent.selectedTab === 'home'
	}
}]);
