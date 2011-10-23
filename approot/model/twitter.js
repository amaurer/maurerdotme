


//Include Request module for http calls
var request = require('request');

// Include Cachet to maintain http resonses for a duration of time
var cachet = require('../helpers/cachet.js');

//http://search.twitter.com/search.json?q=maurerdotme
// Set base url to be used later in request of twitter feed
var _baseURL = 'http://search.twitter.com/search.json?q=';
var _accountName = '';

/**
	@description : Init function to setup account Info. 
	@param : accountName is the flickr api key.
*/
exports.init = function(accountName){

	_accountName = accountName || '';

	return this;
		
};

/**
	@description : 
*/
exports.getLatest = function(callback){

	var uri = _baseURL + _accountName;

	// If response is cached, use it
	if(cachet.isCache(uri)){
		callback(null, cachet.getCache(uri).value);
		return;
	};

	// Make http request for data
	request(uri, function(error, req){

		// Set cached for later use
		cachet.setCache(uri, JSON.parse(req.body), .5);

		// return cached object
		callback(error, cachet.getCache(uri).value);

	});

};
