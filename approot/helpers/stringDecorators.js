

// Removes any characters that cannot be used as a folder name. This List could be increased.
String.prototype.toFolderNameSafe = function(){ 
	return this.toLowerCase().replace(/[\?\.\-\,\;\!\#\@]+/g, '').replace(/\W+/g, '-');
};

