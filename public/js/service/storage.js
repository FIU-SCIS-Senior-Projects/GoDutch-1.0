'use strict';

app.factory('storage', function(){
	var factory = {};
	factory.get = function(id){
		return localStorage.getItem(id) || '';
	}
	factory.put = function(id, item){
		localStorage.setItem(id, item);
	}

	return factory;
});
