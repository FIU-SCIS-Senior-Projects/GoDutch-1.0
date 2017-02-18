'use strict';

angular.module('indexApp').controller('navbarCtrl', ['$scope', function($scope){
	$scope.template = { name: 'navbar.html', url: '/html/navbar.html'};
}]);