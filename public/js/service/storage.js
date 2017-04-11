'use strict';

app.factory('storage', function(){
	var factory = {};
	factory.get = function(id){
		var fake = ''
		if(id == 'token')
			fake = 'fake'
		return localStorage.getItem(id) || fake;
	}
	factory.put = function(id, item){
		localStorage.setItem(id, item);
	}

	return factory;
});
