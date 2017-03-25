'use strict';

angular.module('indexApp').controller('contactCtrl', ['$scope', 'socket', function($scope, socket){
	$scope.template = { name: 'contact.html', url: '/html/contact.html'};

	$scope.show = function(){
		return $scope.$parent.selectedTab === 'contact'
	}
}]);
