
var express = require('express');
var app = express.createServer();
var articles = require('./model/articles.js'),
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
		res.render('index.jade', {
			layout : 'layouts/single_col_full.jade',
			title : 'Is cool',
			article : articles.getArticleList()[0]
		});
	});
	app.get('/articles/', function(req, res){
		res.render('article.jade', {
			layout : 'layouts/single_col_full.jade',
			title : 'Is cool'
		});
	});
	app.get('/profile/', function(req, res){
		res.render('profile.jade', {
			layout : 'layouts/single_col_full.jade',
			title : 'Is cool'
		});
	});
	app.get('/pics/', function(req, res){
		res.render('pics.jade', {
			layout : 'layouts/single_col_full.jade',
			title : 'Is cool'
		});
	});

	app.listen(3000);
	   