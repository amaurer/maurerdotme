
//var sections = content.match(/<section>([\s\S]*?)<\/section>/g);

var content = prev.getResponseDataAsString();
var photoWrapper = content.match(/<div\sid="photosWrapper".+>([\s\S]*?)<\/div>/g);
var photoLinks = [];
var random = 0;

/* You must check as null, do not check the length property */
if(photoWrapper == null){
	
	prev.setResponseCode(500);
	prev.setResponseMessage("Could not find Photo Wrapper.");

} else {

	photoLinks = photoWrapper[0].match(/<a\shref="(.*?)"/g);

	if(photoLinks == null){

		prev.setResponseCode(500);
		prev.setResponseMessage("Could not find Photo Links.");		

	} else {
		
		random = Math.floor(Math.random() * photoLinks.length);
		vars.put("selectedPhotoLink", photoLinks[random].replace(/.*?"/, "").replace(/"/g, ""));

	};

};
