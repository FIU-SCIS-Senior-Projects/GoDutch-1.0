'use strict';

angular.module('indexApp').controller('signupCtrl', ['$scope', function($scope){
    $scope.signupVisible = false;
	$scope.template = { name: 'signup.html', url: '/html/signup.html'};
}]);