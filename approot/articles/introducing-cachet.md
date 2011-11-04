/***
title=Cachet - JavaScript Object Caching at your fingers!
createdDateTime=1320419326
author=Andrew Maurer
uid=2011110401
summary=I've created a caching module for Node.js, jQuery and JavaScript. Its easy to use and extremely simple.
*/

####[Cachet](http://github.com/amaurer/Cachet "Cachet - A simple way to maintain objects with an expiration duration")

####What is it?
A small collection of functions (get, set, is) that maintains name/value pairs for a duration of time. For each name/value stored, you can set an expiration date/time or pass in a float value that represents the duration of hours until expiration.

####What what programming languages can I use it in?
Currently it is written for Node.js but I do have plans to create more versions of it in other languages.


####Where would I use it?
I've recently written this site to consumer values from the Flickr API. I wanted to collect all of my available public images but I didn't want to request them for each request. So, I make an initial call and saving it into Cachet with a set duration of expiration. Subsequent request do not need an http request to Flickr but rather, a lookup into Cachet which is fast.

####OK I get it, how do I use it?

	var cachet = require("cachet");
	var myComplexObject;
	var myReturnedCachedObjectWithNameExpirationAndValue;

	/* Check every one minute */
	setInterval(function(){

		if(!cachet.isCache("andrewTest")){
			
			myComplexObject = {
				andrew : "can do",
				someCool : "stuff"
			};

			/* Set expires in 2 minutes 30 seconds */
			cachet.setCache("andrewTest", myComplexObject, new Date().getTime() + 150000);

			/*
			Expiration time can be an integer as well. It is translated into hours
			cachet.setCache("andrewTest", myComplexObject, 1.5);
			*/

		};

		myReturnedCachedObjectWithNameExpirationAndValue = cachet.getCache("andrewTest");

		console.log(myReturnedCachedObjectWithNameExpirationAndValue);

	}, 60000); 

