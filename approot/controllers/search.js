

exports.init = function(app, async, articlesModel, flickrModel){

	app.get('/search/:searchTag', function(req, res){

		var articlesData = articlesModel.getArticleByID(req.params.articleID);
		// Get title data?
		res.render('articleDetails', {
			layout : 'layouts/single_col_full',
			title : 'Is cool',
			photosList : flickrData.photos,
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
				photosList : flickrData.photos.photo,
				articlesList : articleData
			});

		});

	});
	
};