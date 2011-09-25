
var express = require('express');
var app = express.createServer();
var articles = require('./model/articles.js').init('./articles/', 'md'),
	flickr = require('./model/flickr.js').init('88adb0866be21dff0d9ccd21706360e1', '58050551@N04'),
	twitter = require('./model/twitter.js');

	app.configure(function(){
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.use(express.methodOverride());
		app.use(express.bodyParser());
		app.use(app.router);
		app.use(express.static(__dirname + '/assets'));
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.get('/', function(req, res){
		res.render('index', {
			layout : 'layouts/single_col_full',
			title : 'Is cool',
			articles : articles.getArticles('title', true)
		});
	});
	
	/* Include the Controllers */
	require('./controllers/articles.js').init(app, articles);
	require('./controllers/photos.js').init(app, flickr);
	require('./controllers/profile.js').init(app);

	app.listen(3000);
	   