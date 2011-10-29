
var cachet = require('../helpers/cachet.js');
var request = require('request');
var base_url = 'http://flickr.com/services/rest/?';
var api_key = '';
var user_id = '';
var format = 'json';

function RequestObject(rn, rp){
	this.requestName = rn || '';
	this.requestParams = rp || {};
	return this;
}

function requestInterface(options, callback){

	var params = getParamsURL(options.requestName, options.requestParams);

	if(cachet.isCache(params)){
		if(callback) callback.call(this, null, cachet.getCache(params).value);
		return;
	};

	request(base_url + params, function(e, r, d){
		if(e && callback){
			callback.call(this, e, d);
		} else if (e){
			throw e;
		}
		// Is Evil ?
		eval(d);
		function jsonFlickrApi(dd){
			//TODO : dd.getPhotoURL = api.helpers.getPhotoURL;
			cachet.setCache(params, dd, 6);
			if(callback != null){
				callback.call(this, null, cachet.getCache(params).value);
			}
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
			// Add if value is not null
			if(paramsObject[n]) a.push(n + '=' + paramsObject[n]);
		};
		return a.join('&');
	};

};

var api = {

	helpers : {
		photoSizes : {
			thumbnail : {
				abrv : 't',
				description : '75x75'
			},
			sqaure : {
				abrv : 's',
				description : '75x75'
			},
			small : {
				abrv : 'm',
				description : '40 on longest side'
			},
			medium : {
				abrv : '-',
				description : '500 on longest side'
			},
			mediumLarge : {
				abrv : 'z',
				description : '640, 640 on longest side'
			},
			large : {
				abrv : 'b',
				description : '1024 on longest side'
			},
			original : {
				abrv : 'o',
				description : 'original image, either a jpg, gif or png, depending on source format'
			}
		},
		getPhotoURL : function(photoObject, size){

			var photoSizes = api.helpers.photoSizes;

			var s = '//farm';
				s += photoObject.farm;
				s += '.static.flickr.com/';
				s += photoObject.server + '/';
				s += photoObject.id + '_';
				s += photoObject.secret + '_';

				if(photoSizes[size] != null){
					s += photoSizes[size];
				} else {
					s += 'm';
				}

				s += '.jpg';

				return s;
			
		}
	},

	photos : {
		search : function(params, callback){
			var options = {
				sort : 'date-taken-desc',
				tags : null,
				text : null,
				per_page : '200'
			};
			if(typeof params === 'function'){ // If user just wants default params
				callback = params;
			} else {
				for(var n in options){
					if(params[n] != null){
						options[n] = params[n];
					};
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

	return api;
};