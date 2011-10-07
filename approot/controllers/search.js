

exports.init = function(app, articlesModel, flickrModel){

	app.get('/search/:searchTag', function(req, res){
		res.send(req.params.searchTag);
		return;
		var articlesData = articlesModel.getArticleByID(req.params.articleID);
		// Get title data?
		res.render('articleDetails', {
			layout : 'layouts/single_col_full',
			title : 'Is cool',
			article : articlesModel.getArticleByID(req.params.articleID)
		});
	});

	app.post('/search', function(req, res){

		var phrase = req.body.search || '';

		var articleData = articlesModel.search(phrase);

		var flickrOptions = {
			tags : phrase
		};

		flickrModel.photos.search(flickrOptions, function(e, flickrData){
			
			res.render('search', {
				layout : 'layouts/single_col_full',
				title : 'Is cool',
				searchPhrase : phrase,
				flickr : flickrData.photos,
				articles : articleData
			});

		});

	});
	
};