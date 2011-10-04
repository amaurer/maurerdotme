/*Copyright (c) 2011, Andrew Maurer andrew@maurer.me

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/


var customSettings = require('./customSettings.js');
var express = require('express');
var app = express.createServer();
var articles = require('./model/articles.js').init('./articles/', 'md'),
	flickr = require('./model/flickr.js').init(customSettings.flickr.api_key, customSettings.flickr.user_id),
	twitter = require('./model/twitter.js').init(customSettings.twitter.account_name);

	app.configure(function(){
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.use(express.methodOverride());
		app.use(express.bodyParser());
		app.use(app.router);
		app.use(express.static(__dirname + '/assets'));
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.listen(3000);

	app.get('/', function(req, res){
		twitter.getLatest(function(data){
			//tweet.text.replace('/[@]{1}[\w]*?$1/gi', '<a href="http://twitter.com/$1/">$1</a>')
			res.render('index', {
				layout : 'layouts/single_col_full',
				title : 'Is cool',
				articles : articles.getArticles('title', true),
				tweets : data.results
			});
		});
	});
	
	/* Include the Controllers */
	require('./controllers/articles.js').init(app, articles);
	require('./controllers/photos.js').init(app, flickr);
	require('./controllers/profile.js').init(app);
   