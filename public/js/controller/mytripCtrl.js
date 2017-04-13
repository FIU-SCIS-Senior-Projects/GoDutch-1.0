'use strict';

angular.module('indexApp').controller('mytripCtrl', ['$scope', 'socket', function($scope, socket){
	$scope.template = { name: 'mytrip.html', url: '/html/mytrip.html'};
	$scope.newTrip = { name: "New Trip" };
	$scope.tripToJoin = { id: "" };
	$scope.userToInvite = { email: "" };
	$scope.show = function(){
		return $scope.$parent.selectedTab === 'mytrip'
	}
	$scope.showResult = false;
	$scope.result = "";

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

	var inputInterval = 1000;

	// temporarily use number to represent persons. need personModel later.
	$scope.addTrip = function() {
		var newTrip = new tripModel($scope.newTrip.name, "", [], [], [new personModel($scope.$parent.profile.username)]);
		socket.emit('createTrip', newTrip);
	}

	$scope.joinTrip = function() {
		var tripid = $scope.tripToJoin.id;
		console.log('triptojoin: ', $scope.tripToJoin);
		var exist = false;
		for (var i = 0; i < $scope.$parent.trips.length; i++)
			if ($scope.$parent.trips[i].room === tripid)
				exist = true;
		console.log($scope.$parent.profile.id, $scope.$parent.profile.username, tripid);
		if (!exist)
			socket.emit('joinTrip', {userid: $scope.$parent.profile.id, username: $scope.$parent.profile.username, tripid: tripid});
		else
			console.log('you are already in this trip');
	}

	$scope.invite = function() {
		if ($scope.currentTripIndex < 0)
			console.log("You need to be in a trip");
		else {
			var email = $scope.userToInvite.email;
			var tripid = $scope.$parent.trips[$scope.currentTripIndex].room;

		}
	}

	socket.on('joinTripSuccess', function(room) {
		console.log(room, 'here');
		socket.emit('joinroom', room, $scope.$parent.profile.username);
		$scope.currentTripIndex = 0;
		$scope.loadTrip();
	});

	socket.on('joinTripFailure', function(error) {
		console.log('Failed to join trip', error.message);
	});

	$scope.loadTrip = function() {
		socket.emit('loadTrip', $scope.$parent.profile.id);
	}

	socket.on('loadTripSuccess', function(triplist) {
		$scope.$parent.trips.length = 0;
		for (var i = 0; i < triplist.length; i++)
			$scope.$parent.trips.push(triplist[i]);
		console.log('loadTripSuccess: ', triplist);
		$scope.$apply();
		$scope.viewTrip($scope.currentTripIndex);
	});

	socket.on('loadTripFailure', function(error) {
		console.log('Failed to load trip', error.message);
	});

	// add parameter index to select a trip from trip list.
	$scope.viewTrip = function(index) {
		$scope.currentTripIndex = index;
		var curTrip = $scope.$parent.trips[index];
		$scope.purchasers = [];
		$scope.items = [];
		$scope.consumers = [];
		curTrip.consumers.forEach(function(c) {
			$scope.consumers.push(new personModel(c.name));
		});	
		curTrip.purchasers.forEach(function(p) {
			$scope.purchasers.push($scope.consumers.find(function(ele){
				return p && ele.name === p.name;
			}));
		});
		curTrip.items.forEach(function(i) {
			var pur = [];
			var pay = [];
			var con = [];
			i.purchasers.forEach(function(p) {
				pur.push($scope.consumers.find(function(ele){
					return p && ele.name === p.name;
				}));
			});
			i.payments.forEach(function(p) {
				pay.push(p);
			});
			i.consumers.forEach(function(c) {
				con.push($scope.consumers.find(function(ele){
					return c && ele.name === c.name;
				}));
			});
			$scope.items.push(new itemModel(i.name, pur, pay, con));
		})
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
												payment: parseFloat(curItem.payments[j])});
			}
			for (j = 0; j < curItem.consumers.length; j++) {
				mapPushHelper(c2iMap, curItem.consumers[j], curItem);
				mapPushHelper(i2cMap, curItem, curItem.consumers[j]);
			}
		}
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
		$scope.$parent.trips.unshift(trip);
		$scope.currentTripIndex = 0;
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
		if ($scope.$parent.trips && $scope.$parent.trips[$scope.currentTripIndex]) {
			socket.emit('saveTrip', $scope.$parent.trips[$scope.currentTripIndex]);
		}
	}

	$scope.deleteTrip = function() {
		if ($scope.$parent.trips)
			socket.emit('deleteTrip', $scope.$parent.trips[$scope.currentTripIndex]);
	}

	$scope.addItem = function() {
		var consumers = $scope.consumers.slice();
		$scope.detail.currentItem = new itemModel("New Item", [], [], consumers);
		$scope.detail.moneySpent = 0.00;
		$scope.detail.didConsume = true;
		$scope.$parent.trips[$scope.currentTripIndex].items.push($scope.detail.currentItem);
		$scope.viewTrip($scope.currentTripIndex);
	}

	$scope.editDetail = function(index) {
		var cur = $scope.items[index];
		var i;
		$scope.detail.moneySpent = 0.00;
		$scope.detail.didConsume = false;
		var list = i2pMap.get(cur);
		for (i = 0; list && i < list.length; i++)
			if (list[i].purchaser.name === $scope.$parent.profile.username) {
				$scope.detail.moneySpent = list[i].payment;
			}
		list = i2cMap.get(cur);
		for (i = 0; list && i < list.length; i++)
			if (list[i].name === $scope.$parent.profile.username)
				$scope.detail.didConsume = true;
		$scope.detail.currentItem = $scope.$parent.trips[$scope.currentTripIndex].items[index];
		$scope.showDetail = true;
	}

	var findUser = function(person) { 
		return person.name === $scope.$parent.profile.username;
	}

	var findPurchaser = function(item) {
		return item.purchasers.find(findUser);
	}

	var amountTimeout;
	$scope.amountChanged = function(payment){
		if (amountTimeout) clearTimeout(amountTimeout);
		amountTimeout = setTimeout(function () {
			$scope.paymentChange(payment);
			console.log('change');
		}, inputInterval);
	}

	var nameTimeout;
	$scope.nameChanged = function(name){
		clearTimeout(nameTimeout);
		console.log('timeout: ', nameTimeout);
		nameTimeout = setTimeout(function () {
			$scope.detail.currentItem.name = name;
			console.log('change');
		}, inputInterval);
	}

	var findWithAttr = function(array, value) {
		for(var i = 0; i < array.length; i++) {
			if(array[i].name === value) {
				return i;
			}
		}
		return -1;
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
					$scope.$parent.trips[$scope.currentTripIndex].purchasers.push(user);
				}
			} else {
				var user = $scope.consumers.find(findUser);
				var index = findWithAttr($scope.detail.currentItem.purchasers, user.name);
				$scope.detail.currentItem.payments[index] = payment;
			}
		} else {
			if (list != null && list.find(findUser)) {
				var user = $scope.consumers.find(findUser);
				var index = findWithAttr($scope.detail.currentItem.purchasers, user.name);
				$scope.detail.currentItem.purchasers.splice(index, 1);
				$scope.detail.currentItem.payments.splice(index, 1);
				if (!$scope.$parent.trips[$scope.currentTripIndex].items.find(findPurchaser)) {
					index = findWithAttr($scope.$parent.trips[$scope.currentTripIndex].purchasers, user.name);
					$scope.$parent.trips[$scope.currentTripIndex].purchasers.splice(index, 1);
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
				var index = findWithAttr($scope.detail.currentItem.consumers, user.name);
				$scope.detail.currentItem.consumers.splice(index, 1);
			}
		}
		$scope.viewTrip($scope.currentTripIndex);
	}

	$scope.calculate = function() {
		if ($scope.$parent.trips)
			socket.emit('calculate', $scope.$parent.trips[$scope.currentTripIndex]);
	}

	socket.on('result', function(data) {
		$scope.result = data;
		$scope.showResult = true;
		$scope.$apply();
	});

	socket.on('saveSuccess', function(room) {
		console.log("ROOM: ", room);
		if ($scope.$parent.trips[$scope.currentTripIndex] && $scope.$parent.trips[$scope.currentTripIndex].room == "") {
			$scope.$parent.trips[$scope.currentTripIndex].room = room;
			socket.emit('joinroom', room, $scope.$parent.profile.username);
		}
	});

	socket.on('saveFailure', function(error) {
		console.log(err.message);
	});

	var tripTimeout;
	$scope.$watch('trips[currentTripIndex]',
		function (newValue, oldValue) {
			console.log('tripTimeout: ', tripTimeout)
			if (tripTimeout) clearTimeout(tripTimeout);
			tripTimeout = setTimeout(function () {
				$scope.saveTrip();
				console.log('saved');
			}, inputInterval);
		}, true
	);

	socket.on('update', function(message) {
		console.log('update: ', message);
		$scope.loadTrip();
	});
}]);
