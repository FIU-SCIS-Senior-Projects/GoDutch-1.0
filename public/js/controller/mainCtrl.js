'use strict';

angular.module('indexApp').controller('mainCtrl', ['$scope','$http', function($scope, $http){
    
	$scope.isLoggedIn = false;
	$scope.visibleLogin = true;

	$http.post('/signup', '','').
	then (	
		function(res){//success	
			console.log(res)
			if(res === 'success'){
				$scope.isLoggedIn = true
				$scope.visibleLogin = false	
			}
		},function(res){//failure	
			console.log(res);	
		}	
	);
		
}]);
