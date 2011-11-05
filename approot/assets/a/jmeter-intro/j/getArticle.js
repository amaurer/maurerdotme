
//var sections = content.match(/<section>([\s\S]*?)<\/section>/g);

var content = prev.getResponseDataAsString();
var articleListSummary = content.match(/<section><div\sid="articleListSummary".+>([\s\S]*?)<\/div><\/section>/g);
var articleLinks = [];
var random = 0;

/* You must check as null, do not check the length property */
if(articleListSummary == null){
	
	prev.setResponseCode(500);
	prev.setResponseMessage("Could not find Articles Summary.");

} else {

	articleLinks = articleListSummary[0].match(/<a\shref="(.*?)"/g);

	if(articleLinks == null){

		prev.setResponseCode(500);
		prev.setResponseMessage("Could not find Articles Links.");		

	} else {
		
		random = Math.floor(Math.random() * articleLinks.length);
		vars.put("selectedArticleLink", articleLinks[random].replace(/.*?"/, "").replace(/"/g, ""));

	};

};
