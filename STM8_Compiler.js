var http = require('http');
var Url = require('url');
var fs = require('fs');
var Path = require('path');
var ChildProcess = require('child_process');

function CreateServer(Port){
	console.log("STM8 Compiler Server on " + Port + "");
	var httpServer = http.createServer(function(req, res){
		var port = Port;
		var host = req.headers.host;
		var url = "http://" + host + ":" + port + req.url;
		url = Url.parse(url.toLowerCase(), true);
		res.setHeader("Access-Control-Allow-Headers", "debug-mode,origin,content-type");
		res.setHeader("Access-Control-Expose-Headers", "content-type,debug-mode,Content-Type,ETag,Finish,Server,ServerUrl,ServiceUrl,ManageUrl,Date,Start,Load,Node,NodeId, NodeType");
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, PUT, POST, HEAD, OPTIONS, SEARCH");
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.finish = finish;
		Process(req, res, url, host, port);
	}).listen(Port);
	httpServer.on('error', function(err){
		console.error(err);
	});
}

processCounter = 0;

function finish(sc, rs){
	this.statusCode = sc;
	this.end(rs);
}

function Process(req, res, url, host, port){
	try{
		if (processCounter > 0){
			setTimeout(function(){
				Process(req, res, url, host, port);
			}, 1000);
			console.log("BUSY: " + processCounter);
			return;
		}
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		var dirName = Path.basename(Path.resolve("C:\\Node\\HLAB\\STM8" + url.path));
		console.log("Compiling " + dirName);
		processCounter++;
		var cp = ChildProcess.spawn("C:\\Node\\HLAB\\Build.cmd",[dirName],{ stdio: ['ignore', 'pipe', 'pipe'] });
		var errStr = "";
		var logStr = "";
		cp.stderr.on('data', function (data) {
			errStr += data;
		});
		cp.stdout.on('data', function (data) {
			logStr += data;
		});
		cp.on('close', function (code) {
			processCounter--;
			try{
				console.log('Exec code: ' + code);
				res.finish(200, "ERRCODE:" + code + "\nSTDERR:\n" + errStr + 'STDOUT:\n' + logStr); 
			}
			catch (err){
				res.statusCode = 500;
				res.end(err + "");
			}
		});
	}
	catch (err){
		console.error("ERR IN PROCESS:");
		console.error(err);
	}
}

CreateServer(process.argv[2]);
