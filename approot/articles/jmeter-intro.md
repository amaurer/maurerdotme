/***
title=Begin using JMeter for your testing!
createdDateTime=1320420795
author=Andrew Maurer
uid=2011110402
summary=Start using JMeter after reading this short tutorial. JMeter is an extremely powerful regression and performance engine.
*/

###JMeter - Powerful but Not Intuitive
I started using JMeter about a month ago. Creating a basic test plan was a cinch! I was all finished with my test and I ran it a few million times. Then I noticed that the variables weren't updating over each iteration... UH-OH... Back to the drawing-board.

###So my new preferred method...
Since these variables weren't updating over every interation and I also got the feeling that things were getting a bit messy, I decided to look into BSF scripts. Turns out, this is a great solution to put all your logic into the same file as well as have the ability to change user variables as often as needed. Doin this gives you the greatest flexability and control over your tests that you can get. 

###BSF Options
When writing BSF scripts, you have several options to choose from...

* JavaScript (Rhino)
* Jexl
* XSLT
* Beanshell

I know JavaScript very well so it was a no-brainer as to what language to choose. While its the same JavaScript you know and love, writing BSF scripts is not for the faint of heart. You are going to drive yourself mad if you aren't extremely confident in your JavaScript syntax and coding skills. I say this because debugging JMeter is a rather difficult task. If something isn't coded right, JMeter is NOT going to throw an exception. Instead, JMeter will happily ignore your script and continue processing.

Here are a few recommendations...

-----------------------------

#####[Using User Defined Variables](/a/jmeter-intro/i/jmeter-user-defined-variables.jpg)
Create a user variables config element to setup some variables to be used throughout your scripts. These can be called later like so...

`${bsfFilePath}`

[![Using User Defined Variables](/a/jmeter-intro/i/jmeter-user-defined-variables-fit.jpg)](/a/jmeter-intro/i/jmeter-user-defined-variables.jpg)

-----------------------------

#####[HTTP Request Sampler](/a/jmeter-intro/i/jmeter-http-request-sampler-defaults.jpg)
Create a HTTP Request Sampler Default. This is handy because you would have to specify these details for every HTTP Request Sampler if you didn't. Now that you have this configured, you can leave most fields blank in your subsequent HTTP Request Handlers because they consume the defaults.

[![HTTP Request Sampler](/a/jmeter-intro/i/jmeter-http-request-sampler-defaults-fit.jpg)](/a/jmeter-intro/i/jmeter-http-request-sampler-defaults.jpg)

-----------------------------

#####[Response Code Assertion in Sampler](/a/jmeter-intro/i/jmeter-response-code-assertion.jpg)
For every sampler, I suggest at least some simple assertion to verify everything is OK. For EVERY HTTP Request Sampler I create a statusCode assertion. This verifies that the header status code has a value of 200 and not something else. If it were a different, status, then your flow or variables are likely incorrect.

[![Response Code Assertion in Sampler](/a/jmeter-intro/i/jmeter-response-code-assertion-fit.jpg)](/a/jmeter-intro/i/jmeter-response-code-assertion.jpg)

-----------------------------

#####[BSF Post-Processor - JavaScript](/a/jmeter-intro/i/jmeter-bsf-script-post-processor.jpg)
This is where I do my heavy lifting. I write a script for each type of Sampler as a post-processor. This allows me to have the greatest flexibility when managing the response content and getting/setting variables. I always create an external script and concatenate the user variable that has my script path and my script name. Inside my script, I can change the response code to 500 if something goes wrong too.

[![BSF Post-Processor - JavaScript](/a/jmeter-intro/i/jmeter-bsf-script-post-processor-fit.jpg)](/a/jmeter-intro/i/jmeter-bsf-script-post-processor.jpg)

-----------------------------

#####[Using Variables Set by the BSF Post-Processor](/a/jmeter-intro/i/jmeter-use-variable-in-http-request-sampler.jpg)
No different then using User Defined Variables. Set them in the script and consume them normally.

[![Using Variables Set by the BSF Post-Processor](/a/jmeter-intro/i/jmeter-use-variable-in-http-request-sampler-fit.jpg)](/a/jmeter-intro/i/jmeter-use-variable-in-http-request-sampler.jpg)

-----------------------------

#####[Use Results Tree For Testing](/a/jmeter-intro/i/jmeter-results-tree-view.jpg)
When building your script, you'll want to use the results tree listener to debug your code. If you add the debug sampler, it will show you the variables in this view.

[![Use Results Tree For Testing](/a/jmeter-intro/i/jmeter-results-tree-view-fit.jpg)](/a/jmeter-intro/i/jmeter-results-tree-view.jpg)

-----------------------------

#####[Performance Summary of Maurer.me running Node.js](/a/jmeter-intro/i/jmeter-nodejs-performance-summary.jpg)
In Summary, here is my [test](/a/jmeter-intro/jmeter-intro.js) and a list of JS files I created.

######Test
* [maurerdotme Test Plan](/a/jmeter-intro/maurerdotme.jmx.xml)

######Scripts
* [getArticle.js](/a/jmeter-intro/j/getArticle.js)
* [getArticleResult.js](/a/jmeter-intro/j/getArticleResult.js)
* [getPhoto.js](/a/jmeter-intro/j/getPhoto.js)
* [getPhotoResult.js](/a/jmeter-intro/j/getPhotoResult.js)

######Reference
* HTTP Request Sampler - [http://jakarta.apache.org/jmeter/usermanual/component_reference.html](http://jakarta.apache.org/jmeter/usermanual/component_reference.html "HTTP Request Sampler")
* Sampler Result Class Reference - [http://jakarta.apache.org/jmeter/api/org/apache/jmeter/protocol/http/sampler/HTTPSampleResult.html](http://jakarta.apache.org/jmeter/api/org/apache/jmeter/protocol/http/sampler/HTTPSampleResult.html "Sampler Result Class Reference")
* Complete JMeter Reference - [http://jakarta.apache.org/jmeter/api/](http://jakarta.apache.org/jmeter/api/ "Complete JMeter Reference")
* Regex Tester - [http://jakarta.apache.org/oro/demo.html](http://jakarta.apache.org/oro/demo.html "Regex Tester")

[![Performance Summary of Maurer.me running Node.js](/a/jmeter-intro/i/jmeter-nodejs-performance-summary-fit.jpg)](/a/jmeter-intro/i/jmeter-nodejs-performance-summary.jpg)

