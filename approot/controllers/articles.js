

exports.init = function(app, articlesModel){

	app.get('/articles/:articleTitle/:articleID', function(req, res){
		var articlesData = articlesModel.getArticleByID(req.params.articleID);
		// Get title data?
		res.render('articleDetails', {
			layout : 'layouts/single_col_full',
			title : 'Is cool',
			page : 'articles',
			article : articlesModel.getArticleByID(req.params.articleID)
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
			title : 'Is cool',
			page : 'articles',
			articlesList : arts
		});
	});
	
};