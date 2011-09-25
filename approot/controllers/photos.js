

exports.init = function(app, flickrModel){

	app.get('/photos', function(req, res){
		flickrModel.inParallel({
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
					if(a.length <11) a.push(data.photos[i]);
				};
				res.render('photos', {
					layout : 'layouts/single_col_full',
					title : 'Is cool',
					flickr : {
						photos : a, // limited to 10
						photoCollection : data.photos,
						tags : data.tags
					}
				});
		});
	});
	
	app.get('/photos/:photoTitle/:photoID', function(req, res){
		flickrModel.photos.search('', function(){
			//console.log(arguments);
			res.send('don');
		});
	});
	
};