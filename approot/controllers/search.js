

exports.init = function(app, async, articlesModel, flickrModel){

	app.all('/search/:searchTag?', function(req, res){

		var phrase = 'mish-mash this is garbage'; // use string with one space to return everything

		if(req.body != null && req.body.search != null){
			phrase = req.body.search;	
		} else if (req.params != null && req.params.searchTag != null && req.params.searchTag.length !== 0){
			phrase = req.params.searchTag;
		};

		console.log(phrase);

		var articleData = articlesModel.search(phrase);

		var flickrOptions = {
			tags : phrase
		};

		flickrModel.photos.search(flickrOptions, function(e, flickrData){
			
			res.render('search', {
				layout : 'layouts/single_col_full',
				title : 'Is cool',
				page : 'search',
				searchPhrase : phrase,
				photosList : flickrData.photos.photo,
				articlesList : articleData
			});

		});

	});
	
};