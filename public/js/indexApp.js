'use strict';

var app = angular.module('indexApp', []).config(['$locationProvider', function($locationProvider){
	$locationProvider.hashPrefix('');
}]);
