

// Removes any characters that cannot be used as a folder name. This List could be increased.
String.prototype.toFolderNameSafe = function(){ 
	return this.toLowerCase().replace(/[\?\.\-\,\;\!\#\@]+/g, '').replace(/\W+/g, '-');
};

// Returns a font size based on value
String.prototype.toTagPopularitySize = function(){

	var val = Number(this);
	var fs = '';

	if(val / 10 < 1){
		fs = val / 10 + 1 + "em";
	} else if (val / 10 > 2){
		fs = "2em";
	} else {
		fs = val / 10 + "em";
	};
	
	return fs;
}

Date.prototype.toEST = function(){
	
}