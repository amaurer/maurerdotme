
var request = require('request');
var async = require('async');

var base_url = 'http://flickr.com/services/rest/?';
var api_key = '';
var user_id = '';
var format = 'json';
var saved_requests = {};

function RequestObject(rn, rp){
	this.requestName = rn || '';
	this.requestParams = rp || {};
	return this;
}

function requestInterface(options, callback){

	var params = getParamsURL(options.requestName, options.requestParams);

	if(typeof saved_requests[params] !== 'undefined'){
		if(callback) callback.call(this, null, saved_requests[params]);
		return true;
	};

	request(base_url + params, function(e, r, d){
		if(e && callback) callback.call(this, d)
		else if (e) throw e;
		eval(d); // Is Evil ?
		function jsonFlickrApi(dd){
			saved_requests[params] = dd;
			if(callback) callback.call(this, null, dd);
		}
	});

	function getParamsURL(method, paramsObject){
		var a = [
			'api_key=' + api_key,
			'user_id=' + user_id,
			'format=' + format,
			'method=' + method
		];
		for(var n in paramsObject){
			if(paramsObject[n]) a.push(n + '=' + paramsObject[n]); // Add if value is not null
		};
		return a.join('&');
	};

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
		},
		getInfo : function(photo_id, callback){
			requestInterface(new RequestObject('flickr.photos.getInfo', {photo_id : photo_id}), callback);
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

	api.inParallel = async.parallel;

	return api;
};