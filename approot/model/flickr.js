
var request = require('request');
var async = require('async');

var base_url = 'http://flickr.com/services/rest/?';
var api_key = '';
var user_id = '';
var format = 'json';
var saved_requests = {
};
/*
http://flickr.com/services/rest/?
api_key=88adb0866be21dff0d9ccd21706360e1&
user_id=58050551@N04&
format=json&
jsoncallback=jsonp1316715760979&
method=photos.search&
text=&
sort=date-taken-desc
*/

function RequestObject(rn, rp){
	this.requestName = rn || '';
	this.requestParams = rp || {};
	return this;
}

function requestInterface(options, callback){

	if(typeof saved_requests[options.requestName] !== 'undefined'){
		if(callback) callback.call(this, null, saved_requests[options.requestName]);
		return true;
	};

	request(getBaseURL(options.requestName, options.requestParams), function(e, r, d){
		if(e && callback) callback.call(this, d)
		else if (e) throw e;
		eval(d); // Is Evil ?
		function jsonFlickrApi(dd){
			saved_requests[options.requestName] = dd;
			if(callback) callback.call(this, null, dd);
		}
	});

	function getBaseURL(method, paramsObject){
		var a = [
			'api_key=' + api_key,
			'user_id=' + user_id,
			'format=' + format,
			'method=' + method
		];
		for(var n in paramsObject){
			if(paramsObject[n]) a.push(n + '=' + paramsObject[n]); // Add if value is not null
		};
		return base_url + a.join('&');
	};

};

function inParallel(arrayOfCalls, callback){
	async.parallel(arrayOfCalls, callback);
};

var api = {

	photos : {
		search : function(params, callback){
			var options = {
				sort : 'date-taken-desc',
				tags : null,
				text : null
			};
			if(typeof params === 'function'){ // If user just wants default params
				callback = params;
			} else {
				for(var n in options){
					if(typeof params[n] !== undefined) options[n] = params[n];
				};
			}
			requestInterface(new RequestObject('flickr.photos.search', options), callback);
		}
	},
	tags : {
		getListUserPopular : function(callback){
			requestInterface(new RequestObject('flickr.tags.getListUserPopular'), callback);
		}
	}

};


exports.init = function(apiKey, userID, requestFormat){

	api_key = apiKey || '';
	user_id = userID || '';
	format = requestFormat || 'json';
	saved_requests = {};

	api.inParallel = inParallel;

	return api;
};