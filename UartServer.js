var http = require('http');
var Url = require('url');
var fs = require('fs');
var paths = require('path');
var edge = require('edge');

try{
	require(paths.resolve("./Modules/Utils.js"));
	require(paths.resolve("./Modules/Channels.js"));
	require(paths.resolve('./Modules/Logger.js'));
	require(paths.resolve('./Uart.js'));
	
	process.on('SIGTERM', function() {

	});
	
	process.on('exit',function(){	
		if (UartServer.HTTPServer){
			UartServer.HTTPServer.close();
		}
	});
	
	UartServer = {};

	UartPorts = {};
	
	var args = {
		Port: 80
	};
	if (process.argv[2]){
		args = process.argv[2];
		args = JSON.parse(args);
	}
	
	UartServer.Config = args;
	UartServer.Init = function(config, globalConfig, logger){
		if (config){
			UartServer.Config = config;
		}
		if (UartServer.Config.ProxyPort) UartServer.Config.ProxyPort = UartServer.Config.Port;
		if (!module){
			setTimeout(StaticServer.Start, 100);
		}
	};
			
	UartServer.Start = function(){
		Channels.on("uart.open", function(message, data, url, headers){
			var port = this.path;
			console.log('connecting ' + port);
			port = UartPorts[port];
			if (port){
				if (!port.opened){
					port.Open(data.speed, data.timeout);
				}
			}
			else{
				port = UartPorts[port] = new Uart(port, data.speed, data.timeout);
				port.Open(data.speed, data.timeout);
			}
		});
		if (!module){
			if (!UartServer.HTTPServer){
				UartServer.HTTPServer = http.createServer(UartServer.ProcessRequest);
				UartServer.HTTPServer.listen(UartServer.Config.ProxyPort);
			}
		}
	};
		
	UartServer.Stop = function(){
		if (!module){
			if (UartServer.HTTPServer){
				UartServer.HTTPServer.close();
				UartServer.HTTPServer = null;
			}
		}
	};
	
	UartServer.ProcessRequest = function(req, res){
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, PUT, POST, HEAD, OPTIONS, SEARCH");
		res.setHeader("Access-Control-Allow-Headers", "debug-mode,origin,content-type");
		res.setHeader("Access-Control-Max-Age", "12000");
		res.setHeader("Access-Control-Expose-Headers", "content-type,debug-mode,Content-Type,ETag,Finish,Date,Start,Load");		
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		if (req.method == 'OPTIONS'){
			res.statusCode = 200;
			res.end("OK");	
			return;
		}
		var url = Url.parse(req.url);
		try{
			return false;	
		}
		catch (e){
			error(e);
		}
	};
	
	UartServer.ProcessContext = function(context){
		context.setHeader("Access-Control-Allow-Origin", "*");
		context.setHeader("Access-Control-Allow-Methods", "GET, DELETE, PUT, POST, HEAD, OPTIONS, SEARCH");
		context.setHeader("Access-Control-Allow-Headers", "debug-mode,origin,content-type");
		context.setHeader("Access-Control-Max-Age", "12000");
		context.setHeader("Access-Control-Expose-Headers", "content-type,debug-mode,Content-Type,ETag,Finish,Date,Start,Load");		
		context.setHeader("Content-Type", "text/plain; charset=utf-8");
		if (context.req.method == 'OPTIONS'){
			context.finish(200, "OK");	
			return true;
		}
		try{
			return true;
		}
		catch (e){
			error(e);
		}
		return true;
	};
	
	if (module){
		module.exports = UartServer;
	}
	else{
		UartServer.Init();
	}
}
catch(e){
	if (global.error){
		global.error(e);	
		if (!module){
			console.log("exiting..");
			process.exit();
		}
	}
	else{
		throw(e);
	}
}