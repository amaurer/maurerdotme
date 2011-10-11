exports.init = function(app, flickrModel){

	app.get('/contact', function(req, res){
		res.render('contact', {
			layout : 'layouts/single_col_full',
			page : 'contact',
			title : 'Is cool'
		});
	});

	app.get('/contact/submit', function(req, res){
		res.render('contact', {
			layout : 'layouts/single_col_full',
			page : 'contact',
			title : 'Is cool'
		});
	});

};