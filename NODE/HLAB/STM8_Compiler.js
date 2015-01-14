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

function finish(sc, rs){
	this.statusCode = sc;
	this.end(rs);
}

function Process(req, res, url, host, port){
	try{
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		var dirName = Path.basename(req.pathName);
		console.log("Compiling " + req.pathName);
		var cp = ChildProcess.execFile("C:\\Node\\HLAB\\Build.cmd",[dirName], null, function(error, stdout, stderr){
		  try{
			  if (error){
				  res.finish(500, error + ''); 
				  console.log('exec error: ' + error);
			  }
			  console.log('stdout: ' + stdout);
			  console.log('stderr: ' + stderr);
			  res.finish(200, stdout + ''); 
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
