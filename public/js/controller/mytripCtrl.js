'use strict';

angular.module('indexApp').controller('mytripCtrl', ['$scope', 'socket', function($scope, socket){
	$scope.template = { name: 'mytrip.html', url: '/html/mytrip.html'};

	$scope.show = function(){
		return $scope.$parent.selectedTab === 'mytrip'
	}
	$scope.username = "test";
	$scope.trips = [];
	$scope.purchasers = [];
	$scope.items = [];
	$scope.consumers = [];

	$scope.currentItem = {
		name: new itemModel("New Item", [], [], []),
		moneySpent: 0.00,
		didConsume: true
	};
	$scope.currentTripIndex = -1;
	$scope.showDetail = false;
	var p2iMap = new Map(),
		i2pMap = new Map(),
		i2cMap = new Map(),
		c2iMap = new Map();


	var mapPushHelper = function(map, key, value) {
		if (!map.get(key)) {
			map.set(key, []);
		}
		map.get(key).push(value);
	}

	// temporarily use number to represent persons. need personModel later.
	$scope.addTrip = function() {
		// var newTrip = new tripModel("New Trip", "", [], [], [new personModel("test")]);
		// $scope.trips.unshift(newTrip);
		// $scope.currentTripIndex = 0;
		// $scope.viewTrip(0);
		
		createTest();
		var room = "random";
		socket.emit('room', room);
	}

	// add parameter index to select a trip from trip list.
	$scope.viewTrip = function(index) {
		var curTrip = $scope.trips[index];
		$scope.purchasers = curTrip.purchasers;
		$scope.items = curTrip.items;
		$scope.consumers = curTrip.consumers;
		p2iMap = new Map();
		i2pMap = new Map();
		i2cMap = new Map();
		c2iMap = new Map();
		var i, j;
		for (i = 0; i < $scope.items.length; i++) {
			var curItem = $scope.items[i];
			for (j = 0; j < curItem.purchasers.length; j++) {
				mapPushHelper(p2iMap, curItem.purchasers[j], curItem);
				mapPushHelper(i2pMap, curItem, {purchaser: curItem.purchasers[j],
												payment: curItem.payments[j]});
			}
			for (j = 0; j < curItem.consumers.length; j++) {
				mapPushHelper(c2iMap, curItem.consumers[j], curItem);
				mapPushHelper(i2cMap, curItem, curItem.consumers[j]);
			}
		}

		$scope.saveTrip();
	}

	// for testing purpose only
	var createTest = function() {
		var trip = new tripModel("trip1", "", [], [], []);
		var i;
		for (i = 0; i < 15; i++) {
			trip.consumers.push(new personModel("p"+i));
		}
		for (i = 0; i < 5; i++) {
			trip.purchasers.push(trip.consumers[i]);
		}

		for (i = 0; i < 15; i++) {
			var name = "i"+i;
			var purchasers = [trip.purchasers[i%5]];
			var payments = [(i+1) * 5];
			var consumers = [trip.consumers[(i+1)%15], 
							 trip.consumers[(i+2)%15], 
							 trip.consumers[(i+3)%15]];
			var item = new itemModel(name, purchasers, payments, consumers);
			trip.items.push(item);
		}
		$scope.trips.push(trip);
		$scope.viewTrip(0);
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
		for (var i = 0; list && i < list.length; i++) 
			list[i].active = true;
	}

	$scope.enterItem = function(index) {
		hideAll();
		var cur = $scope.items[index];
		cur.active = true;
		var list = i2pMap.get(cur);
		for (var i = 0; list && i < list.length; i++) 
			list[i].purchaser.active = true;
		list = i2cMap.get(cur);		
		for (var i = 0; list && i < list.length; i++) {
			list[i].active = true;
		}
	}

	$scope.enterConsumer = function(index) {
		hideAll();
		var cur = $scope.consumers[index];
		cur.active = true;
		var list = c2iMap.get(cur);
		for (var i = 0; list && i < list.length; i++) 
			list[i].active = true;
	}

	$scope.saveTrip = function() {
		console.log($scope.trips);
		if ($scope.trips)
			socket.emit('saveTrip', $scope.trips[0]);
	}

	$scope.deleteTrip = function() {
		
	}

	$scope.addItem = function() {
		var item = new itemModel("New Item", [], [], $scope.consumers);
		$scope.currentItem = {
			name: item.name,
			moneySpent: 0.00,
			didConsume: true
		};
		$scope.trips[$scope.currentTripIndex].items.push(item);
		$scope.showDetail = true;
		$scope.viewTrip($scope.currentTripIndex);
	}

	$scope.editDetail = function(index) {
		var cur = $scope.items[index];
		var i, moneySpent = 0, didConsume = false;
		var list = i2pMap.get(cur);
		for (i = 0; list && i < list.length; i++)
			if (list[i].purchaser.name === $scope.username)
				$scope.currentItem.moneySpent = list[i].payment;
		list = i2cMap.get(cur);
		for (i = 0; list && i < list.length; i++)
			if (list[i].name === $scope.username)
				didConsume = true;
		$scope.currentItem = $scope.items[index];
		$scope.showDetail = true;
	}
}]);
