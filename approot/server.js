
var express = require('express');
var app = express.createServer();
var articles = require('./model/articles.js').init('./articles/', 'md'),
	flickr = require('./model/flickr.js'),
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
			layout : 'layouts/single_col_full.jade',
			title : 'Is cool',
			articles : articles.getArticles('title', false)
		});
	});
	app.get('/articles/:articleTitle/:articleID', function(req, res){
		res.render('articleDetails', {
			layout : 'layouts/single_col_full.jade',
			title : 'Is cool',
			article : articles.getArticleByID(req.params.articleID)
		});
	});
	app.get('/articles/', function(req, res){
		res.render('article', {
			layout : 'layouts/single_col_full.jade',
			title : 'Is cool'
		});
	});
	app.get('/profile/', function(req, res){
		res.render('profile', {
			layout : 'layouts/single_col_full.jade',
			title : 'Is cool'
		});
	});
	app.get('/pics/', function(req, res){
		res.render('pics', {
			layout : 'layouts/single_col_full.jade',
			title : 'Is cool'
		});
	});

	app.listen(3000);
	   