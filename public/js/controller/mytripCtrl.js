'use strict';

angular.module('indexApp').controller('mytripCtrl', ['$scope', function($scope){
	$scope.template = { name: 'mytrip.html', url: '/html/mytrip.html'};

	$scope.show = function(){
		return $scope.$parent.selectedTab === 'mytrip'
	}

	$scope.trips = [];
	$scope.purchasers = [];
	$scope.item = [];
	$scope.consumers = [];
		$scope.trips.push(new tripModel());
		$scope.trips.push(new tripModel());

	$scope.addTrip = function() {
		var trip = new tripModel();
		trip.name = "trip1";
		trip.id = "1234567";
		for (var i = 0; i < 10; i++) {
			var name = "item"+i;
			var purchasers = [i%5];
			var consumers = [(i+1)%10, (i+2)%10, (i+3)%10];
			var item = new itemModel(name, purchasers, consumers);
			trip.items.push(item);
			trip.consumers.push(i);
		}
		trip.purchasers = [1, 2, 3, 4, 5];
		$scope.viewTrip(trip);
	}

	$scope.viewTrip = function(trip) {
		$scope.purchasers = trip.purchasers;
		$scope.items = [];
		for (var i = 0; i < trip.items.length; i++)
			$scope.items.push(trip.items[i].name);
		$scope.consumers = trip.consumers;
	}

	$scope.saveTrip = function() {
		
	}

	$scope.deleteTrip = function() {
		
	}
}]);