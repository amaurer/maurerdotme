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

// Setup
var customSettings = require('./customSettings.js'),
	express = require('express'),
	app = express.createServer(),
	async = require('async');

// Model
var articles = require('./model/articles.js').init('./articles/', 'md'),
	flickr = require('./model/flickr.js').init(customSettings.flickr.api_key, customSettings.flickr.user_id),
	twitter = require('./model/twitter.js').init(customSettings.twitter.account_name);

// Helpers
	require('./helpers/stringDecorators.js');


	app.configure(function(){
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.use(express.methodOverride());
		app.use(express.bodyParser());
		app.use(app.router);
		app.use(express.static(__dirname + '/assets'));
		//app.use(express.static(__dirname + '/assets', { maxAge: 31557600000 }));
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.listen(3000);

	app.get('/', function(req, res){
		async.parallel({
				flickrPhotos : function(cb){
					flickr.photos.search(function(e, data){
						cb(e, (e)? [] : data.photos.photo);
					});
				},
				twitterLatest : function(cb){
					twitter.getLatest(function(e, data){
						cb(e, (e)? [] : data.results);
					});
				}
			},
			function(e, data){

				// Initialize Vars
				var photosArray = [],
					articlesArray = [],
					tweetsArray = [],
					i = 0;

				// Collect Data
				var arts = articles.getArticles('title', true),
					photos = data.flickrPhotos,
					tweets = data.twitterLatest;

				// Loop over results to filter on 8 of them for summary
				for (i = 0; i < photos.length; i++) {
					if(photosArray.length <9){
						photosArray.push(photos[i]);
					} else {
						break;
					};
				};

				// Loop over results to filter on 5 of them for summary
				for (i = 0; i < arts.length; i++) {
					if(articlesArray.length <6){
						articlesArray.push(arts[i]);
					} else {
						break;
					};
				};

				// Loop over results to filter on 10 of them for summary
				for (i = 0; i < tweets.length; i++) {
					if(tweetsArray.length <11){
						tweetsArray.push(tweets[i]);
					} else {
						break;
					};
				};
				
				// Render
				res.render('index', {
					layout : 'layouts/single_col_full',
					title : 'Is cool',
					page : 'home',
					articlesList : articlesArray,
					tweetsList : tweetsArray,
					photosList : photosArray
				});

		});
	});
	
	/* Include the Controllers */
	require('./controllers/articles.js').init(app, articles);
	require('./controllers/photos.js').init(app, async, flickr);
	require('./controllers/search.js').init(app, async, articles, flickr);
	require('./controllers/profile.js').init(app);
	require('./controllers/contact.js').init(app);
   