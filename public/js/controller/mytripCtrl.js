'use strict';

angular.module('indexApp').controller('mytripCtrl', ['$scope', function($scope){
	$scope.template = { name: 'mytrip.html', url: '/html/mytrip.html'};

	$scope.show = function(){
		return $scope.$parent.selectedTab === 'mytrip'
	}

	$scope.trips = [];
	$scope.purchasers = [];
	$scope.items = [];
	$scope.consumers = [];
	$scope.trips.push(new tripModel());
	$scope.trips.push(new tripModel());
	var p2iMap = new Map();
	var i2pMap = new Map();
	var i2cMap = new Map();
	var c2iMap = new Map();

	var mapPushHelper = function(map, key, value) {
		if (!map.get(key))
			map.set(key, []);
		map.get(key).push(value);
	}

	// temporarily use number to represent persons. need personModel later.
	$scope.addTrip = function() {
		var trip = new tripModel("", "", [], [], []);
		trip.name = "trip1";
		trip.id = "1234567";
		var i;
		for (i = 0; i < 15; i++) {
			trip.consumers.push(new personModel("c"+i));
		}
		for (i = 0; i < 5; i++) {
			trip.purchasers.push(new personModel("p"+i));
		}

		for (i = 0; i < 15; i++) {
			var name = "i"+i;
			var purchasers = [trip.purchasers[i%5]];
			var consumers = [trip.consumers[(i+1)%15], 
							 trip.consumers[(i+2)%15], 
							 trip.consumers[(i+3)%15]];
			var item = new itemModel(name, purchasers, consumers);
			trip.items.push(item);
			var j;
			for (j = 0; j < purchasers.length; j++) {
				mapPushHelper(p2iMap, purchasers[0], item);
				mapPushHelper(i2pMap, item, purchasers[j]);
				// $scope.p2iMap[purchasers[j]].push(i);
				// $scope.i2pMap[i].purchasers.push(purchasers[j]);
			}
			for (j = 0; j < consumers.length; j++) {
				mapPushHelper(c2iMap, consumers[j], item);
				mapPushHelper(i2cMap, item, consumers[j]);
			// 	// $scope.c2iMap[consumers[j]].push(i);
			// 	// $scope.i2cMap[i].consumers.push(consumers[j]);
			}
		// console.log(i2cMap);
		}
		$scope.viewTrip(trip);
	}

	$scope.viewTrip = function(trip) {
		$scope.purchasers = trip.purchasers;
		$scope.items = [];
		for (var i = 0; i < trip.items.length; i++) {
			$scope.items.push(trip.items[i]);
		}
		$scope.consumers = trip.consumers;
	}

	var hideAll = function() {
		var i;
		for (i = 0; i < $scope.purchasers.length; i++) 
			$scope.purchasers[i].active = false;
		for (i = 0; i < $scope.items.length; i++) 
			$scope.items[i].active = false;
		for (i = 0; i < $scope.consumers.length; i++) 
			$scope.consumers[i].active = false;
	}

	var showAll = function() {
		var i;
		for (i = 0; i < $scope.purchasers.length; i++) 
			$scope.purchasers[i].active = true;
		for (i = 0; i < $scope.items.length; i++) 
			$scope.items[i].active = true;
		for (i = 0; i < $scope.consumers.length; i++) 
			$scope.consumers[i].active = true;
	}

	$scope.leave = function() {
		showAll();
	}

	$scope.enterPurchaser = function(index) {
		hideAll();
		var cur = $scope.purchasers[index];
		cur.active = true;
		var list = p2iMap.get(cur);
		for (var i = 0; i < list.length; i++) 
			list[i].active = true;
	}

	$scope.enterItem = function(index) {
		hideAll();
		var cur = $scope.items[index];
		cur.active = true;
		var list = i2pMap.get(cur);
		for (var i = 0; i < list.length; i++) 
			list[i].active = true;
		list = i2cMap.get(cur);
		for (var i = 0; i < list.length; i++) 
			list[i].active = true;
	}

	$scope.enterConsumer = function(index) {
		hideAll();
		var cur = $scope.consumers[index];
		cur.active = true;
		var list = c2iMap.get(cur);
		for (var i = 0; i < list.length; i++) 
			list[i].active = true;
	}

	$scope.saveTrip = function() {
		
	}

	$scope.deleteTrip = function() {
		
	}
}]);