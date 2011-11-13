/***
title=Node.js vs ColdFusion Performance
createdDateTime=1320621242
author=Andrew Maurer
uid=2011110403
summary=A simple performance test with a base install of Node.js, ColdFusion9 and MySQL.
tags=Nodejs, ColdFusion, MySQL, Performance
*/

###The Showdown
Ok this isn't really a showdown. Both Nodejs and ColdFusion have their strong points and I didn't spend the time to go through them all. My question was simple, how much traffic can I ram down their throats and how quick will they respond. I incorporated a SQL insert into a local MySQL database. Now I will say, I had to use [cluster](http://learnboost.github.com/cluster/) to make it fair. Coldfusion will be using multiple threads along with Apache. Node running a single thread just isn't fair so I added one (1) worker per CPU for Nodejs. Also, I did verify that CF was able to process 10 simaltaineous requests. I left the default CF settings in-tact and of course, debugging was not turned on. **Note - I am using [express](https://github.com/visionmedia/express) to handle routes. My initial setup was using a good amount of configuration options which turned out to be very slow.


###Results - Winner Nodejs
![ColdFusion vs Nodejs with MySQL INSERT](/a/node-vs-coldfusion-performance/i/coldfusion-vs-nodejs-performance.jpg)

###Here is the code I used

####Coldfusion - [index.cfm](/a/node-vs-coldfusion-performance.md/coldfusion.cfm.txt)
	
	<cfquery name="inserttets" datasource="mycooldatasource">
	INSERT INTO inserttest (created)
	VALUES (#now()#);
	</cfquery>

	DONE!


####Nodejs - [server.js](/a/node-vs-coldfusion-performance.md/node.js.txt)	

	var express = require('express');
	var app = express.createServer();
	var cluster = require('cluster');
	var datetime = require('datetime');
	var mysql = require('mysql');
	var client = mysql.createClient({
		user: 'memyselfandi',
		password: 'youdontcareaboutthis',
		database: 'whatareyoulookingat'
	});

	app.get('/', function(req, res){
		
		var d = datetime.format(new Date(), "%Y-%m-%d %T");

		client.query("INSERT INTO inserttest SET created= ?", [d], function(err) {
			if (err) {
				res.writeHead(500, {'Content-Type': 'text/plain'});
				res.end('DUDE SUX!');
				throw err;
			}
			res.send("DONE!");
		});
	});

	cluster(app)
		.set('workers', 8)
		.listen(8080);



-----------------------------

#####[Performance Summary of Maurer.me running Node.js](/a/jmeter-intro/i/jmeter-nodejs-performance-summary.jpg)
In Summary, here is my [test](/a/jmeter-intro/jmeter-intro.js) and a list of JS files I created.

######Test
* [maurerdotme Test Plan](/a/jmeter-intro/maurerdotme.jmx.xml)

######Scripts
* [getArticleResult.js](/a/jmeter-intro/j/getArticleResult.js)
* [getPhoto.js](/a/jmeter-intro/j/getPhoto.js)
* [getPhotoResult.js](/a/jmeter-intro/j/getPhotoResult.js)

######Reference
* HTTP Request Sampler - [http://jakarta.apache.org/jmeter/usermanual/component_reference.html](http://jakarta.apache.org/jmeter/usermanual/component_reference.html "HTTP Request Sampler")
* Sampler Result Class Reference - [http://jakarta.apache.org/jmeter/api/org/apache/jmeter/protocol/http/sampler/HTTPSampleResult.html](http://jakarta.apache.org/jmeter/api/org/apache/jmeter/protocol/http/sampler/HTTPSampleResult.html "Sampler Result Class Reference")
* Complete JMeter Reference - [http://jakarta.apache.org/jmeter/api/](http://jakarta.apache.org/jmeter/api/ "Complete JMeter Reference")
* Regex Tester - [http://jakarta.apache.org/oro/demo.html](http://jakarta.apache.org/oro/demo.html "Regex Tester")

[![Performance Summary of Maurer.me running Node.js](/a/jmeter-intro/i/jmeter-nodejs-performance-summary-fit.jpg)](/a/jmeter-intro/i/jmeter-nodejs-performance-summary.jpg)

