


//Include Request module for http calls
var request = require('request');

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

	request(_baseURL + _accountName, function(error, req){
		callback(JSON.parse(req.body));
	});

};
