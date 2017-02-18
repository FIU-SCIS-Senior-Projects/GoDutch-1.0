'use strict';

angular.module('indexApp').controller('navbarCtrl', ['$scope', 'navigation', function($scope, navigation){
	// selectedTab = 'mytrip';
	$scope.template = { name: 'navbar.html', url: '/html/navbar.html'};
}]);