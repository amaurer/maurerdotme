

exports.init = function(app, async, articleModel, flickrModel){

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

	app.all('/search/:searchTag?', function(req, res){

		var phrase = 'mish-mash this is garbage'; // use string with one space to return everything

		if(req.body != null && req.body.search != null){
			phrase = req.body.search;	
		} else if (req.params != null && req.params.searchTag != null && req.params.searchTag.length !== 0){
			phrase = req.params.searchTag;
		};

		var articleData = articleModel.search(phrase);

		var flickrOptions = {
			tags : phrase
		};

		async.parallel({
				flickrPhotos : function(cb){
					flickrModel.photos.search(flickrOptions, function(e, data){
						cb(e, (e)? [] : data.photos.photo);
					});
				},
				flickrTags : function(cb){
					flickrModel.tags.getListUserPopular(function(e, data){
						cb(e, (e)? [] : data.who.tags.tag);
					});
				},
			},
			function(e, data){

				// TODO : Cache these
				sortedTags = articleModel.getTags().concat(data.flickrTags).sort(sortTags);
			
				res.render('search', {
					layout : 'layouts/single_col_full',
					title : 'Search Results for ' + phrase,
					page : 'search',
					searchPhrase : phrase,
					photosList : data.flickrPhotos,
					articlesList : articleData,
					tagsList : sortedTags,
					search : phrase
				});
			
		});

	});
	
};