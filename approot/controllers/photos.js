

exports.init = function(app, async, flickrModel){

	app.get('/photos', function(req, res){
		async.parallel({
				tags : function(cb){
					flickrModel.tags.getListUserPopular(function(e, data){
						cb(e, (e)? [] : data.who.tags.tag);
					});
				},
				photos : function(cb){
					flickrModel.photos.search(function(e, data){
						cb(e, (e)? [] : data.photos.photo);
					});
				}
			},
			function(e, data){
				for (var i = 0, a = []; i < data.photos.length; i++) {
					if(a.length <11){
						a.push(data.photos[i]);
					} else {
						break;
					}
				};
				res.render('photos', {
					layout : 'layouts/single_col_full',
					title : 'Is cool',
					flickr : {
						photosList : a, // limited to 10
						photoCollection : data.photos,
						tags : data.tags
					}
				});
		});
	});
	
	app.get('/photos/:photoTitle/:photoID', function(req, res){
		flickrModel.photos.getInfo(req.params.photoID, function(e, data){
			res.send(JSON.stringify(data));
		});
	});
	
	app.get('/photos/:tags', function(req, res){
		var options = {
			tags : req.params.tags
		};
		flickrModel.photos.search(options, function(e, data){
			res.send(JSON.stringify(data));
		});
	});
	
};