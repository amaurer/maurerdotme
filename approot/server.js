
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
			articles : articles.getArticles('title', true),
			flickr : {
				photos : flickr.getTopPhotos(),
				tags : flickr.getTags()
			}
		});
	});
	app.get('/articles/:articleTitle/:articleID', function(req, res){
		var articles = articles.getArticleByID(req.params.articleID);
		// Get title data? */
		res.render('articleDetails', {
			layout : 'layouts/single_col_full',
			title : 'Is cool',
			article : articles.getArticleByID(req.params.articleID)
		});
	});
	app.get('/articles', function(req, res){
		res.render('articles', {
			layout : 'layouts/single_col_full',
			title : 'Is cool'
		});
	});
	app.get('/profile', function(req, res){
		res.render('profile', {
			layout : 'layouts/single_col_full',
			title : 'Is cool'
		});
	});
	app.get('/pics', function(req, res){
		flickr.photos.search('', function(e, photos){
			var count = 0;
			for(var n in photos) count++;
			console.log(count);
			res.send('done');
		});
		/*
		res.render('pics', {
			layout : 'layouts/single_col_full',
			title : 'Is cool',
			flickr : {
				photos : flickr.getPhotos(),
				tags : flickr.getTags()
			}
		});
		*/
	});
	app.get('/photos/:photoTitle/:photoID', function(req, res){
		flickr.photos.search('', function(){
			//console.log(arguments);
			res.send('don');
		});

		/*
		res.render('pics', {
			layout : 'layouts/single_col_full',
			title : 'Is cool',
			flickr : {
				photo : flickr.photos.getPhotoById(req.params.photoID)
			}
		});
		*/
	});

	app.listen(3000);
	   