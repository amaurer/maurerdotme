

var articles = [];
var nmd = require('node-markdown').Markdown;
var fs = require('fs');

exports.init = function(articleDirectory){

	fs.readdir(articleDirectory, function(err, files) {
		if (err) return;

		files = files.filter(function(f, i, arr) {
			return (f.substr(-3) === '.md');
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

};

exports.getArticleList = function(){
	return articles;
};
exports.getArticleSummaryList = function(){
	
};
exports.getArticleDetails = function(){
	
};

function Article(){
	var aLen = arguments.length;
	if(aLen !== 0){
		if(typeof arguments[0] === 'object'){
			for(var n in arguemnts[0]) this[n] = arguments[0][n];
		} else {
			if(aLen > 0) this.title = arguemnts[0];
			if(aLen > 1) this.shortTitle = arguemnts[1];
			if(aLen > 2) this.summary = arguemnts[2];
			if(aLen > 3) this.created = arguemnts[3];
		};
	};
	if(typeof this.title === 'undefined') this.title= '';
	if(typeof this.shortTitle === 'undefined') this.shortTitle = '';
	if(typeof this.summary === 'undefined') this.summary = '';
	if(typeof this.body === 'undefined') this.body = '';
	if(typeof this.createdDateTime === 'undefined') this.createdDateTime = new Date();
};