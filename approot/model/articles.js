

var articles = [];
var tags = [];
var nmd = require('node-markdown').Markdown;
var fs = require('fs');

/* TODO add option to save articles in memory or dont *this relies on the user not being able to search the content

*/

exports.init = function(articleDirectory, fileExtension){

	fs.readdir(articleDirectory, function(err, files) {
		if (err) return;

		var fe = fileExtension;

		files = files.filter(function(f, i, arr) {
			return (f.substr(-3) === '.' + fe);
		});

		if(files.length === 0) return; // No files found in articles directory

		for(var i = 0, len = files.length; i <= len; i++){
			fs.readFile(articleDirectory + files[i], function(err, data) {
				if (err) return;
				var parsedMD = getDataFromFile(data.toString());
				articles.push(parsedMD);
			});
		};

	});

	function getDataFromFile(fileData){

		// Prepare the regex and objects for processing
		// TODO : probably some type of overhead creating the regex patterns here because this function executes in a loop.
		//		Move regex outside of loop.
		var reMetaFinder = /^\/\*{3}[\s\S]*?\*\//,
			reReplaceOpenComment = /\/\*{3}[\s]/,
			reReplaceCloseComment = /\s\*\//,
			returnMetaObject = {},
			metaDataMatch = fileData.match(reMetaFinder),
			oSplit = '',
			rawBody = "",
			tagsBunch = [],
			i, ii, x, found = false;

		// MetaData is REQUIRED! 
		if(metaDataMatch.length === 0){
			return false; 
		};

		// Remove commenting declarations
		var metaData = metaDataMatch[0].replace(reReplaceOpenComment, '').replace(reReplaceCloseComment, '').split('\n');

		// Loop over the name/value pairs and set them in an object
		for(i=0, len = metaData.length; i<len; i++){
			oSplit = metaData[i].split("=");
			// Special handler for Tags
			if(oSplit[0].toLowerCase() === "tags"){
				tagsBunch = tagsBunch.concat(oSplit[1].split(","));
			} else {
				returnMetaObject[oSplit[0]] = oSplit[1];
			}
		};

		// Prep tags from large array to
		for(i=0, len = tagsBunch.length; i<len; i++){
			x = tagsBunch[i].toLowerCase().replace(/\s+/g, "");
			found = false;
			for(ii=0, lenn = tags.length; ii<lenn; ii++){
				if(tags[ii]._content.toLowerCase() === x){
					tags[ii].count++;
					found = true;
				};
			};
			if(!found){
				tags.push({
					_content : x,
					count : 1
				});
			}
		};

		// If the user didn't set a time, set it to current so other crap doesn't break.
		if(returnMetaObject.createdDateTime == null){
			returnMetaObject.createdDateTime = new Date().getTime();
		};

		// Get the remainder of the file and pass to MarkDown for parsing.
		rawBody = fileData.replace(reMetaFinder, '');
		
		returnMetaObject.rawBody = rawBody;
		returnMetaObject.body = nmd(rawBody);

		return returnMetaObject;
	};

	return this;

};

// Sort types that an application can use. Static Const.
exports.getTags = function(){
	return tags;
};
// Sort types that an application can use. Static Const.
exports.getArticleSortTypes = function(){
	return ['date', 'author', 'title'];
};

// Return all articles.
exports.getArticles = function(sortType, ascDescBoolean){
	//If the sort type passed is not a string, return false cause you fail!
	if(typeof sortType !== 'string') return articles;

	return exports.getArticlesBySortType.apply(this, arguments);
};

// Return all articles based on sort type.
exports.getArticlesBySortType = function(sortType, ascDescBoolean){
	/*
		return articles sorted by type
		true = asc, false = desc
	*/
	if(typeof sortType !== 'string') return articles;
	sortType = sortType.toString().toLowerCase();

	/* Sort Type doesn't exist so return default sort state */
	if(this.getArticleSortTypes().indexOf(sortType) === -1) return articles;

	function sortAlphabetical(a, b){
		var aa = a[sortType].toLowerCase(), bb = b[sortType].toLowerCase();
		if(!ascDescBoolean){
			aa = b[sortType].toLowerCase(), bb = a[sortType].toLowerCase();
		};

		if(aa > bb){
			return 1;
		} else if(aa < bb){
			return -1;
		};
		return 0;
	};
	 
	// Sorting functions for the different sort types. This should match the sort types array found in this file.
	var sortFunctions = {
		'date' : function(a, b){
			var aa = a['createdDateTime'], bb = b['createdDateTime'];
			if(!ascDescBoolean){
				aa = b['createdDateTime'], bb = a['createdDateTime'];
			};

			if(aa > bb){
				return 1;
			} else if(aa < bb){
				return -1;
			};
			return 0;
		},
		'author' : sortAlphabetical,
		'title' : sortAlphabetical
	};
	return articles.sort(sortFunctions[sortType]);
};

// Returns an article by its requested ID
exports.getArticleByID = function(requestedID){
	for(var i=0, len = articles.length; i<len; i++){
		if(articles[i].uid === requestedID){
			return articles[i];
		};
	};
	return new Article();
};

// Filters articles on title and body
exports.search = function(phrase){

	var re = RegExp('(' + phrase + ')*?', 'gi');

	return articles.filter(function(x){
		return (x.title.search(re) !== -1 || x.rawBody.search(re) !== -1);
	});

};

/* Not used... yet */
function Article(){
	var aLen = arguments.length;
	if(aLen !== 0){
		if(typeof arguments[0] === 'object'){
			for(var n in arguemnts[0]) this[n] = arguments[0][n];
		} else {
			if(aLen > 0) this.author = arguemnts[0];
			if(aLen > 0) this.title = arguemnts[1];
			if(aLen > 1) this.shortTitle = arguemnts[2];
			if(aLen > 2) this.summary = arguemnts[3];
			if(aLen > 3) this.created = arguemnts[4];
		};
	};
	if(typeof this.author === 'undefined') this.author = '';
	if(typeof this.title === 'undefined') this.title = '';
	if(typeof this.shortTitle === 'undefined') this.shortTitle = '';
	if(typeof this.summary === 'undefined') this.summary = '';
	if(typeof this.body === 'undefined') this.body = '';
	if(typeof this.createdDateTime === 'undefined') this.createdDateTime = new Date();
};
  