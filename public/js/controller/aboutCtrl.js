'use strict';

angular.module('indexApp').controller('aboutCtrl', ['$scope', 'socket', function($scope, socket){
	$scope.template = { name: 'about.html', url: '/html/about.html'};

	$scope.show = function(){
		return $scope.$parent.selectedTab === 'about'
	}
}]);
