

var articles = [];
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
		var reMetaFinder = /^\/\*{3}[\s\S]*?\*\//,
			reReplaceOpenComment = /\/\*{3}[\s]/,
			reReplaceCloseComment = /\s\*\//,
			returnMetaObject = {},
			metaDataMatch = fileData.match(reMetaFinder),
			oSplit = '';
		if(metaDataMatch.length === 0) return false; 
		var metaData = metaDataMatch[0].replace(reReplaceOpenComment, '').replace(reReplaceCloseComment, '').split('\n');
		for(i=0, len = metaData.length; i<len; i++){
			oSplit = metaData[i].split('=');
			returnMetaObject[oSplit[0]] = oSplit[1];
		};
		returnMetaObject.body = nmd(fileData.replace(reMetaFinder, ''));
		return returnMetaObject;
	};

	return this;

};

exports.getArticleSortTypes = function(){
	return ['date', 'author', 'title'];
};
exports.getArticles = function(sortType, ascDescBoolean){
	if(typeof sortType !== 'string') return articles;
	return exports.getArticlesBySortType.apply(this, arguments);
};
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
exports.getArticleByID = function(requestedID){
	for(var i=0, len = articles.length; i<len; i++){
		if(articles[i].uid === requestedID){
			return articles[i];
		};
	};
	return new Article();
};
exports.search = function(phrase){
	var re = RegExp(phrase + '*?', 'gi');
	/* We can do this better
	var returnArticles = [];
	for(var i=0, x='', len = articles.length; i<len; i++){
		x = articles[i];
		if(re.find(x.title) !== -1 || re.find(x.body) !== -1){
			returnArticles.push(x);
		};
	}
	*/
	return articles.filter(function(x){
		return (x.title.search(re) !== -1 || x.body.search(re) !== -1);
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
  