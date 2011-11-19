

exports.init = function(app, articlesModel, datetime){

	app.get('/articles/:articleTitle/:articleID', function(req, res){
		var articlesData = articlesModel.getArticleByID(req.params.articleID);
		// Get title data?
		res.render('articleDetails', {
			layout : 'layouts/single_col_full',
			title : articlesData.title,
			page : 'articles',
			article : articlesData
		});
	});

	app.get('/articles', function(req, res){

		// Initialize Vars
		var articlesArray = [],
			i = 0;

		// Collect Data
		var arts = articlesModel.getArticles('date', false);

		// Loop over results to filter on 5 of them for summary
		for (i = 0; i < arts.length; i++) {
			if(articlesArray.length <6){
				articlesArray.push(arts[i]);
			} else {
				break;
			};
		};

		res.render('articles', {
			layout : 'layouts/single_col_full',
			title : 'Articles About Web Technology',
			page : 'articles',
			articlesList : arts
		});
	});
	
};