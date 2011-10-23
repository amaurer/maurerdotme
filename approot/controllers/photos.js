
exports.init = function(app, async, flickrModel){

	// Helpers

	// Builds path to detail page
	var getPhotoDetailLink = function(photoObject){
		return "/photos/" + photoObject.title.toFolderNameSafe() + "/" + photoObject.id + "/";
	};

	// Builds object used on details page to assign to next and previous button
	var getNextPreviousPhotos = function(photoCollection, currentPhotoID){

		var currentPhotoNumber = 0, nextPhoto = {}, previousPhoto = {};
		
		// Find the next and previous photo in the collection
		if(photoCollection.length > 3){
			for (var i = 0, len = photoCollection.length; i < len; i++) {
				x = photoCollection[i];
				// Found the requested image within the collection
				if(x.id === currentPhotoID){
					currentPhotoNumber = i + 1;
					// If i is the last, use the first as next
					if(i === photoCollection.length-1){
						nextPhoto = photoCollection[0];
						previousPhoto = photoCollection[i-1];
					// if i is the first, use the last
					} else if(i === 0) {
						nextPhoto = photoCollection[1];
						previousPhoto = photoCollection[photoCollection.length-1];
					// Else normal previous and after photo
					} else {
						nextPhoto = photoCollection[i+1];
						previousPhoto = photoCollection[i-1];
					}
				}
			};
		};

		return {
			currentPhotoNumber : currentPhotoNumber,
			nextPhoto : nextPhoto,
			previousPhoto : previousPhoto
		};
	};


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
					page : 'photos',
					flickrData : {
						photosList : data.photos, // limited to 10
						photoCollection : data.photos,
						tags : data.tags
					}
				});
		});

	});
	
	app.get('/photos/:photoTitle/:photoID', function(req, res){

		async.parallel({
				photo : function(cb){
					flickrModel.photos.getInfo(req.params.photoID, function(e, data){
						cb(e, (e)? [] : data.photo);
					});
				},
				photoCollection : function(cb){
					flickrModel.photos.search(function(e, data){
						cb(e, (e)? [] : data.photos.photo);
					});
				}
			},
			function(e, data){

				var pc = getNextPreviousPhotos(data.photoCollection);

				res.render('photoDetails', {
					layout : 'layouts/single_col_full',
					title : data.photo.title._content,
					page : 'photos',
					photo : data.photo,
					previousPhoto : {
						href : getPhotoDetailLink(previousPhoto),
						title : pc.previousPhoto.title
					},
					nextPhoto : {
						href : getPhotoDetailLink(nextPhoto),
						title : pc.nextPhoto.title
					},
					currentPhotoNumber : '' + pc.currentPhotoNumber + ' of ' + data.photoCollection.length
				});
		});

	});
	
	app.get('/photos/:tags', function(req, res){
		var options = {
			tags : req.params.tags
		};
			// TODO
		flickrModel.photos.search(options, function(e, data){
			res.send(JSON.stringify(data));
		});
	});
	
};