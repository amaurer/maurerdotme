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

// Configure and Serve
	app.configure(function(){
		app.set('views', './views');
		app.set('view engine', 'jade');
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(app.router);
		app.use(express.static('./assets', { maxAge: 604800000 })); // One week
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

// Model
var articles = require('./model/articles.js')
		.init('./articles/', 'md'),
	flickr = require('./model/flickr.js')
		.init(customSettings.flickr.api_key, customSettings.flickr.user_id),
	twitter = require('./model/twitter.js')
		.init(customSettings.twitter.account_name);


// Helpers
	require('./helpers/decorators.js');
	global.datetime = require('datetime');

	
// Controllers
	require('./controllers/index.js').init(app, async, articles, flickr, twitter);
	require('./controllers/articles.js').init(app, articles);
	require('./controllers/photos.js').init(app, async, flickr);
	require('./controllers/search.js').init(app, async, articles, flickr);
	require('./controllers/profile.js').init(app);
	require('./controllers/contact.js').init(app);


app.listen(8080);