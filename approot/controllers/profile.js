exports.init = function(app, flickrModel){

	app.get('/profile', function(req, res){
		res.render('profile', {
			layout : 'layouts/single_col_full',
			title : 'Is cool'
		});
	});

};