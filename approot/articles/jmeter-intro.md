/***
title=Begin using JMeter for your testing!
createdDateTime=1320420795
author=Andrew Maurer
uid=2011110402
summary=Start using Jmeter after reading this short tutorial. Jmeter is an extremely powerful regression and performance engine.
*/

###JMeter - Powerful but Not Intuitive
I started using Jmeter about a month ago. Creating a basic test plan was a cinch! I was all finished with my test and I ran it a few million times. Then I noticed that the variables weren't updating over each iteration... UH-OH... Back to the drawing-board.

###So my new preferred method...
Since these variables weren't updating over every interation and I also got the feeling that things were getting a bit messy, I decided to look into BSF scripts. Turns out, this is a great solution to put all your logic into the same file as well as have the ability to change user variables as often as needed. Doin this gives you the greatest flexability and control over your tests that you can get. 

###BSF Options
When writing BSF scripts, you have several options to choose from
*JavaScript - (Rhino)
*Jexl
*XSLT
I know JavaScript very well so it was a no-brainer as to what language to choose. While its the same JavaScript you know and love, writing BSF scripts is not for the faint of heart. You are going to drive yourself mad if you aren't extremely confident in your JavaScript syntax and coding skills. I say this because debugging JMeter is a rather difficult task. If something isn't coded right, Jmeter is going going to throw an exception. Instead, Jmeter will happily ignore your script and continue processing.

