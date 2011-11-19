/***
title=Node.js, ODBC and MSSQL Connection
createdDateTime=1321113481000
author=Andrew Maurer
uid=2011111201
summary=I Finally got Nodejs connected to MSSQL via unixODBC and FreeTDS. It wasn't simple so here are my lessions learned
tags=Nodejs,UnixODBC,MSSQL,Performance,FreeTDS
*/

###Routes taken
In researching connecting Nodejs to MSSQL I found only a couple of solutions.

* [An abandoned TDS project](https://github.com/orenmazor/node-tds)
* [node-odbc](https://github.com/wankdanker/node-odbc)

I chose the first one to begin with. I got it "talking" to the MSSQL server but it kept bombing because of buffer errors. The code was using deprecated buffer functions. I changed the source to use the new API. After doing so, I couldn't authenticate with the server. After a couple of hours of failing, I decided to abandon it too.

###Solution
Plan B was to fall back to a (potentially) slower solution and that is ODBC. I was able to download the source and execute it. Now the learning curve was to figure out how to setup a ODBC connection on Ubuntu. [This post](http://lambie.org/2008/02/28/connecting-to-an-mssql-database-from-ruby-on-ubuntu/ "Ubuntu ODBC connect to MSSQL") was a big help configuring the ODBC connections with FreeTDS on Ubuntu. Couple of things I did differently, I didn't put my connection settings in the FreeTDS file but rather, I added it to the /etc/odbc.ini and /etc/odbcinst.ini files as shown below.

#####/etc/odbc.ini File

	[probrems]
	Driver		= FreeTDS
	Trace		= No
	Server		= 10.120.0.115
	Port		= 1433
	Database	= andrew
	UsageCount	= 1
	TDS_Version = 7.0


#####/etc/odbcinst.ini File

	[FreeTDS]
	Description = FreeTDS
	Driver = /usr/lib/odbc/libtdsodbc.so
	Setup = /usr/lib/odbc/libtdsS.so
	FileUsage 	= 1
	CPTimeout 	= 5
	CPReuse 	= 20
	Threading 	= 1

There is probably some fine-tuning that can be done in these settings. For instance, CPReuse I changed from 5 (default) to 20. Guessing that it would give me a bigger connection pool. I also read that changing Threading to 1 can improve performance in a multithreaded environment. [Reference](http://stackoverflow.com/questions/4207458/using-unixodbc-in-a-multithreaded-concurrent-setting)

####VERY Important
I was having some strange behavior when running a high volume of requests through the connector. It seemed to be only inserting 7 records out of 200 and ignoring the remainder. I couldn't explain it other then maybe there was some internal buffer limitation. Turns out that the adding...
	
	TDS_Version = 7.0

... to your /etc/odbc.ini file fixes that issue.


####Outcome
I was very pleased by now that (A) I had Nodejs talking to MSSQL - a requirement to even consider Node in my environment. And (B) Node responds extremely fast even though the ODBC connection seems to queue the requests. That means, I can get a response from Node while my 1000 inserts are still running because they aren't going to return any data.

-----------------------------

#####JMeter Performance Results
This was only using one worker. I could get much greater performance with 1 worker per CPU.
![JMeter Test Plan Nodejs ODBC FreeTDS](/a/nodejs-unixodbc-freetds-mssql/i/nodejs-odbc-tds-performance.jpg)

-----------------------------

#####System Monitor During Jmeter Test
What is interesting here is that Node responded to all the of requests quickly but the ODBC connector or FreeTDS, queued the INSERT statements and sent them to MSSQL asyncronasly. *Note - I know this connection looks slow, it was running on a VM against a SQL VM.
![Nodejs System Monitor INSERT Queue](/a/nodejs-unixodbc-freetds-mssql/i/system-monitor-performance-network-traffic.jpg)

-----------------------------

#####Nodejs Code
Email me if you really want the code, but its simple.
![Nodejs Sublime Text 2 ODBC MSSQL](/a/nodejs-unixodbc-freetds-mssql/i/nodejs-code-odbc.jpg)
