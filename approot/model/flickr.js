
var request = require('request');

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

function getBaseURL(method){

	var a = [
		'api_key=' + api_key,
		'user_id=' + user_id,
		'format=' + format,
		'method=' + method
	];
	return base_url + a.join('&');

};

function RequestObject(){

}

function requestInterface(options, callback){
	if(typeof saved_requests[options.requestName] !== 'undefined'){
		if(callback) callback.call(this, null, saved_requests[options.requestName]);
		return true;
	};
	request(options.requestURL, function(e, r, d){
		if(e && callback) callback.call(this, d)
		else if (e) throw e;
		eval(d); // Is Evil ?
		function jsonFlickrApi(dd){
			saved_requests[options.requestName] = dd;
			if(callback) callback.call(this, null, dd);
		}
	});
};

var api = {

	photos : {
		search : function(sortOrder, callback){
			if(sort)
			var sortO = sortOrder || 'date-taken-desc';
			if(typeof saved_requests['photos.search'] !== 'undefined'){
				if(callback) callback.call(this, null, saved_requests['photos.search']);
				return true;
			};
			request(getBaseURL('flickr.photos.search') + '&sort=' + sortO, function(e, r, d){
				if(e && callback) callback.call(this, d)
				else if (e) throw e;
				eval(d); // Is Evil ?
				function jsonFlickrApi(dd){
					saved_requests['photos.search'] = dd.photos.photo;
					if(callback) callback.call(this, null, dd.photos.photo);
				}
			});
		}
	},
	tags : {
		getListUserPopular : function(callback){
			if(typeof saved_requests['flickr.tags.getListUserPopular'] !== 'undefined'){
				if(callback) callback.call(this, null, saved_requests['photos.search']);
				return true;
			};
			request(getBaseURL('tags.getListUserPopular'), function(e, r, d){
				if(e && callback) callback.call(this, d)
				else if (e) throw e;
				eval(d); // Is Evil ?
				function jsonFlickrApi(dd){
					saved_requests['tags.getListUserPopular'] = dd.tags;
					if(callback) callback.call(this, null, dd.tags);
				}
			});
		}
	}

};


exports.init = function(apiKey, userID, requestFormat){

	api_key = apiKey || '';
	user_id = userID || '';
	format = requestFormat || 'json';
	saved_requests = {};

	return api;
};