/***
title=JavaScript Error Handler in the Browser and Nodejs
createdDateTime=1329069187000
author=Andrew Maurer
uid=20120212
summary=A simple example of creating a global error handler and notification system.
*/

###Wha!?!? I Can Capture JavaScript Errors?
Yep, most developers don't know or aren't using the `window.onerror` method. Its a global function that is fired whenever there is a JavaScript exception thrown. Its default value is `null`. With this handler, you can gain insight into when your application is throwing errors instead of waiting for a customer to tell you things aren't working right. A customer telling you something is wrong is the last thing you want, am I right?!?

###About the Code
The code below is simple enough that I don't need to walk you though it though I will point a few things out

* The `if` surrounding the `window.onerror` method is just a safety net for the possibility that the browser doesn't have this feature.
* The body of the function is yours to do with what you wish. I've used native JavaScript functions to limit the dependency of other assets or features. Now this doesn't mean you can't use jQuery, AJAX or any other libraries but the thing to consider is that if those assets are causing the error, well you'll never know.
* I used an image for this example which lets me make request across domains. If this isn't a concern, then feel free to use AJAX.
* Using `return true` will suppress the JavaScript error from showing in the browser. This means your customer will never know there was a problem. I choose to `return false` because I do want the customer to know things aren't working as expected. Your choice.
* I've seen Chrome Extensions cause this function to fire. A simple solution could be to look at the error message (first argument) for the string " extension ".
* The Nodejs code for this example is meaningless but is a good showing of how to return a image for a request

####JavaScript Code
	

	<!doctype html>
	<html>
		<head>
			<script>

				// In case the browser doesn't have this method
				if(typeof window.onerror !== "undefined"){
					window.onerror=function(e, url, line){

						var queryString = "";
						var queryStringParams = {
							e : e,
							u : url,
							l : line
						};

						for(var n in queryStringParams){
							queryString += (queryString === "")? "?" : "&";
							queryString += n + "=" + escape(queryStringParams[n]);
						};

						//Add epoc time to ensure request isn't cached
						queryString += "&t=" + new Date().getTime().toString();
						
						var img = document.createElement("img");
							img.src = "/g.gif" + queryString;

						window.document.body.appendChild(img).parentNode.removeChild(img);

						return false;
					};
				};

			</script>
		</head>
		<body>
			<script>
				// cause an error
				var a = dafd;
			</script>
		</body>
	</html>


####Nodejs Code

	
	var http = require("http");
	var fs = require("fs");
	// Put an image in memory to return for error logging requests
	var imgFile = fs.readFileSync("./g.gif");

	http.createServer(function (req, res) {

		switch(req.url){

			case "/favicon.ico" :
				// Meh... dun need a favicon for an example
				res.end("404");
				break;

			case "/" :
				// Return index.html
				fs.readFile("./index.html", function(e, data){
					res.writeHead(200, {"Content-Type": "text/html"});
					res.end(data);
				});
				break;
				
			default : 

				// Bust out the querystring params cause we're not interested
				// in using express to make our lives simple...
				var params = {};
				var paramsArray = [];
				var i, x;
				var newURL = ""

				if(req.url.indexOf("?") !== -1){

					newURL = req.url.split("?")[0];

					paramsArray = req.url.split("?")[1].split("&");
					for (i = paramsArray.length - 1; i >= 0; i--) {
						x = paramsArray[i].split("=");
						params[x[0]] = (x.length === 2)? unescape(x[1]) : null;
					};

					if(newURL === "/g.gif"){

						res.writeHead(200, {"Content-Type": "image/gif"});
						res.end(imgFile);

						//Do something with params
						console.log(params);
						
					} else {
						// 404 cause we dont know wut chu talk'n bout 
						// (some page we dont have)
						res.end("404");
					};

				} else {
					// 404 cause we dont know wut chu talk'n bout 
					// (some page we dont have)
					res.end("404");
				};

		};


	}).listen(8080, "127.0.0.1");


