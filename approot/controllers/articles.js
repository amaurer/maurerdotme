

exports.init = function(app, articlesModel){

	app.get('/articles/:articleTitle/:articleID', function(req, res){
		var articlesData = articlesModel.getArticleByID(req.params.articleID);
		// Get title data?
		res.render('articleDetails', {
			layout : 'layouts/single_col_full',
			title : 'Is cool',
			article : articlesModel.getArticleByID(req.params.articleID)
		});
	});
	app.get('/articles', function(req, res){
		res.render('articles', {
			layout : 'layouts/single_col_full',
			title : 'Is cool'
		});
	});
	
};