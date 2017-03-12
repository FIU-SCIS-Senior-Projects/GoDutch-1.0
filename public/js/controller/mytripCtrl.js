'use strict';

angular.module('indexApp').controller('mytripCtrl', ['$scope', 'socket', function($scope, socket){
	$scope.template = { name: 'mytrip.html', url: '/html/mytrip.html'};

	$scope.show = function(){
		return $scope.$parent.selectedTab === 'mytrip'
	}
	$scope.showResult = false;
	$scope.result = "";

	$scope.username = "p0";
	$scope.trips = [];
	$scope.purchasers = [];
	$scope.items = [];
	$scope.consumers = [];

	$scope.detail = {
		currentItem: new itemModel("New Item", [], [], []),
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
		$scope.currentTripIndex = 0;
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
			// console.log("purchasers: ", curItem.purchasers);
			for (j = 0; j < curItem.purchasers.length; j++) {
				mapPushHelper(p2iMap, curItem.purchasers[j], curItem);
				mapPushHelper(i2pMap, curItem, {purchaser: curItem.purchasers[j],
												payment: parseFloat(curItem.payments[j])});
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
			var payments = [parseFloat((i+1) * 5)];
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
		for (i = 0; i < $scope.items.length; i++) 
			$scope.items[i].active = false;
		for (i = 0; i < $scope.consumers.length; i++) {
			$scope.consumers[i].isPurchaser = false;
			$scope.consumers[i].isConsumer = false;
		}
	}

	var showAll = function() {
		var i;
		for (i = 0; i < $scope.items.length; i++) 
			$scope.items[i].active = true;
		for (i = 0; i < $scope.consumers.length; i++) {
			$scope.consumers[i].isPurchaser = true;
			$scope.consumers[i].isConsumer = true;
		}
	}

	$scope.leave = function() {
		showAll();
	}

	$scope.enterPurchaser = function(index) {
		hideAll();
		var cur = $scope.purchasers[index];
		cur.isPurchaser = true;
		var list = p2iMap.get(cur);
		for (var i = 0; list && i < list.length; i++) 
			list[i].active = true;
	}

	$scope.enterItem = function(index) {
		hideAll();
		var cur = $scope.items[index];
		cur.active = true;
		var list = i2pMap.get(cur);
		console.log(list);
		for (var i = 0; list && i < list.length; i++) 
			list[i].purchaser.isPurchaser = true;
		list = i2cMap.get(cur);		
		for (var i = 0; list && i < list.length; i++) {
			list[i].isConsumer = true;
		}
	}

	$scope.enterConsumer = function(index) {
		hideAll();
		var cur = $scope.consumers[index];
		cur.isConsumer = true;
		var list = c2iMap.get(cur);
		for (var i = 0; list && i < list.length; i++) 
			list[i].active = true;
	}

	$scope.saveTrip = function() {
		if ($scope.trips)
			socket.emit('saveTrip', $scope.trips[$scope.currentTripIndex]);
	}

	$scope.deleteTrip = function() {
		if ($scope.trips)
			socket.emit('deleteTrip', $scope.trips[$scope.currentTripIndex]);
	}

	$scope.addItem = function() {
		$scope.detail.currentItem = new itemModel("New Item", [], [], $scope.consumers);
		$scope.detail.moneySpent = 0.00;
		$scope.detail.didConsume = true;
		$scope.trips[$scope.currentTripIndex].items.push($scope.detail.currentItem);
		$scope.viewTrip($scope.currentTripIndex);
	}

	$scope.editDetail = function(index) {
		var cur = $scope.items[index];
		var i;
		$scope.detail.moneySpent = 0.00;
		$scope.detail.didConsume = false;
		var list = i2pMap.get(cur);
		for (i = 0; list && i < list.length; i++)
			if (list[i].purchaser.name === $scope.username) {
				$scope.detail.moneySpent = list[i].payment;
			}
		list = i2cMap.get(cur);
		for (i = 0; list && i < list.length; i++)
			if (list[i].name === $scope.username)
				$scope.detail.didConsume = true;
		$scope.detail.currentItem = $scope.trips[$scope.currentTripIndex].items[index];
				console.log($scope.detail.moneySpent);
		$scope.showDetail = true;
	}

	var findUser = function(person) { 
		return person.name === $scope.username;
	}

	var findPurchaser = function(item) {
		return item.purchasers.find(findUser);
	}

	$scope.paymentChange = function(payment) {
		payment = parseFloat(payment);
		var list = $scope.detail.currentItem.purchasers;
		if (payment > 0) {
			if (list == null || !list.find(findUser)) {
				var user = $scope.consumers.find(findUser);
				$scope.detail.currentItem.purchasers.push(user);
				$scope.detail.currentItem.payments.push(parseFloat(payment));
				if (!$scope.purchasers.find(findUser)) {
					$scope.trips[$scope.currentTripIndex].purchasers.push(user);
				}
			} else {
				var user = $scope.consumers.find(findUser);
				var index = $scope.detail.currentItem.purchasers.indexOf(user);
				$scope.detail.currentItem.payments[index] = payment;
			}
		} else {
			if (list != null && list.find(findUser)) {
				var user = $scope.consumers.find(findUser);
				var index = $scope.detail.currentItem.purchasers.indexOf(user);
				$scope.detail.currentItem.purchasers.splice(index, 1);
				$scope.detail.currentItem.payments.splice(index, 1);
				if (!$scope.items.find(findPurchaser)) {
					index = $scope.trips[$scope.currentTripIndex].purchasers.indexOf(user);
					$scope.trips[$scope.currentTripIndex].purchasers.splice(index, 1);
				}
			}
		}
		$scope.viewTrip($scope.currentTripIndex);
	}

	$scope.consumptionChange = function(value) {
		var list = $scope.detail.currentItem.consumers;
		if (value) {
			var user = $scope.consumers.find(findUser);
			$scope.detail.currentItem.consumers.push(user);
		} else {
			if (list != null && list.find(findUser)) {
				var user = $scope.consumers.find(findUser);
				var index = $scope.detail.currentItem.consumers.indexOf(user);
				$scope.detail.currentItem.consumers.splice(index, 1);
			}
		}
		$scope.viewTrip($scope.currentTripIndex);
	}

	$scope.calculate = function() {
		if ($scope.trips)
			socket.emit('calculate', $scope.trips[$scope.currentTripIndex]);
	}

	socket.on('result', function (data) {
		$scope.result = data;
		$scope.showResult = true;
	});
}]);
