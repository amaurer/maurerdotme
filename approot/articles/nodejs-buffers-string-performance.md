/***
title=Nodejs String Building - Buffers, Arrays and Concatenation
createdDateTime=1321837940000
author=Andrew Maurer
uid=2011112001
summary=There have been plenty of concerns on building strings in JavaScript with the advent of single page browser applications. I'll go over the differences and the considerations.
*/

###Why you should care about how you build strings
In JavaScript, strings are immutable which means that you can't alter the original string. Instead, the old string is kept in memory (and likely abandoned) and a new string is created with your changes. Its important to know this because this method could eat precious memory and processing power.

###The different ways to build strings
There are several different ways to build strings in JavaScript and each has its considerations.

####String Concatenation
This is the most inefficient but common way to build strings. 

####Array Building and Join
The best way to build strings in a browser but still not the best solution.

####Buffers (not browser JavaScript)
The most efficient way to maintain and alter strings because buffers allocate a section of memory and give you the most flexibility. The downside to buffers is that they're more difficult to work with due to the extra functions that you need to invoke.

###The Test Results
Here are the results from these three different methods of string building. There are two factors that you need to look at when testing, speed and memory footprint.

As expected, building a string with a buffer is blazing fast and has a minimal memory footprint.

Next in the speed test is good'ol string concatenation. While its not slow, it creates a massive memory footprint most of which is wasted strings. Strings that were created during each step of the building loop. This method will likely cause the JavaScript engine to run garbage collection more often.

Lastly, Array then join method. While it isn't the fastest, it has a much smaller memory footprint. If you aren't going to use buffers, this is probably the better route for longevity reasons.

####Strings
* Average 14.4ms
* Memory Used 1,774,400

####Arrays
* Average 26.4ms
* Memory Used 896,720

####Buffers
* Average 8.8ms
* Memory Used 322,248

###The Code

	
	console.log("---------Testing Buffers--------");

	var oLen = 1000;
	var baseMemory = process.memoryUsage().heapUsed;
	var stringToWrite = "<!-- start slipsum code -->Well, the way they make shows is, they make one show. That show's called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they're going to make more shows. Some pilots get picked and become television programs. Some don't, become nothing. She starred in one of the ones that became nothing.<!-- end slipsum code -->";

	/*

		Array
		25
		27
		29
		26
		25

		26.4

		896720


		String
		15
		16
		14
		13
		14

		14.4

		1774400


		Buffer
		8
		10
		8
		8
		10

		8.8

		322248

	*/

	/*
	timer(bufferBuild, stringToWrite, oLen);
	timer(stringConcat, stringToWrite, oLen);
	*/
	timer(arrayJoin, stringToWrite, oLen);


	function bufferBuild(s, l){

		var ii, i, b, x, len;

		for(ii=0; ii<l; ii++){
			b = new Buffer(s.length);
			for(i=0, len = s.length; i<len; i++){
				b[i] = s.charCodeAt(i);
			}
			x = b;
		}

	}


	function arrayJoin(s, l){

		var ii, i, b, x, len;

		for(ii=0; ii<l; ii++){
			b = [];
			for(i=0, len = s.length; i<len; i++){
				 b.push(s[i]);
			}
			x = b.join("");
		}
			
	}


	function stringConcat(s, l){

		var ii, i, b, x, len;
			
		for(ii=0; ii<l; ii++){
			b = new String();
			for(i=0, len = s.length; i<len; i++){
				b += s[i];
			}
			x = b;
		}
		
	}


	function timer(f, s, l){

		var startTime = new Date().getTime();

		f(s, l);

		console.log((new Date().getTime() - startTime).toString() + "ms");
		console.log("Memory " + (process.memoryUsage().heapUsed - baseMemory));
		
	}