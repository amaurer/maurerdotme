
//var sections = content.match(/<section>([\s\S]*?)<\/section>/g);

var content = prev.getResponseDataAsString();
var articlesResult = content.match(/<div\sid="articleResults".+>([\s\S]*?)<\/div>/g);
var articleLinks = [];
var random = null;

/* You must check as null, do not check the length property */
if(articlesResult == null){
	
	prev.setResponseCode(500);
	prev.setResponseMessage("Could not find Articles Result.");

} else {

	articleLinks = articlesResult[0].match(/<a\shref="(.*?)"/g);

	if(articleLinks == null){

		prev.setResponseCode(500);
		prev.setResponseMessage("Could not find Articles Links.");		

	} else {
		
		while(random === null || articleLinks[random].match(/\/articles\/[\S]*?\/[\d]*?\//) == null){
			
			random = Math.floor(Math.random() * articleLinks.length);
		}

		vars.put("selectedArticleLink", articleLinks[random].replace(/.*?"/, "").replace(/"/g, ""));

	};

};
