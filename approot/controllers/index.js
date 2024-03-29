
exports.init = function(app, async, articleModel, flickrModel, twitterModel){

	var sortedTags = [];

	function sortTags(a, b){
		var aa = a._content.toLowerCase(),
			bb = b._content.toLowerCase();
		if(aa > bb){
			return 1;
		} else if(aa < bb){
			return -1;
		} else {
			return 0;
		}
	};
	
	app.get('/', function(req, res){
		
		async.parallel({
				flickrPhotos : function(cb){
					flickrModel.photos.search(function(e, data){
						cb(e, (e)? [] : data.photos.photo);
					});
				},
				flickrTags : function(cb){
					flickrModel.tags.getListUserPopular(function(e, data){
						cb(e, (e)? [] : data.who.tags.tag);
					});
				},
				twitterLatest : function(cb){
					twitterModel.getLatest(function(e, data){
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
				var arts = articleModel.getArticles('date', false),
					photos = data.flickrPhotos,
					tweets = data.twitterLatest;

				// Loop over results to filter on 8 of them for summary
				for (i = 0; i < photos.length; i++) {
					if(photosArray.length <18){
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

				// TODO : Cache these
				sortedTags = articleModel.getTags().concat(data.flickrTags).sort(sortTags);

				// Render
				res.render('index', {
					layout : 'layouts/single_col_full',
					title : 'Guru of ColdFusion, Node.js, JavaScript and Webservices',
					page : 'home',
					articlesList : articlesArray,
					tweetsList : tweetsArray,
					photosList : photosArray,
					tagsList : sortedTags
				});

		});
	});

}