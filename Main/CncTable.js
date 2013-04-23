var log = require("./Slog.js").info;
log.error = require("./Slog.js").error;
log.info = log;
require('./Mongo.js');
var http = require('http');
var Url = require('url');
require("./Sutils.js");
ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
var net = require('net');
var RouterModule = require("./Router.js");

try{
	Driver = {};
	
	Driver.State = "none";
	
	Driver.Init = function(){
		Driver.socket = net.connect({port: Server.Config.cncPort}, Driver.Connected);
		Driver.socket.on('data', Driver.Message);
		Driver.socket.on('error', Driver.Error);
		Driver.socket.on('end', Driver.Disconnected);
	};
	
	Driver.Error = function(data){
		Driver.Connected = false;
		Driver.State = "error";
		dlog.error(data);
		setTimeout(Driver.Init, 5000);
	};
	
	Driver.Connected = function(){
		Driver.State = "connected";
		Driver.Connected = true;
		dlog.info("Socket connected on: " + Server.Config.cncPort);
		setInterval(Driver.Poll, 2000);
	};
	
	Driver.Message = function(data){
		if (data.length > 255){
			dlog.error("Received big data!");
			return;
		}
		var obj = {};
		if (data.length >= 17 && (data[0] >= 1 || data[0] <= 3))
		{
			obj.command = data[0];
			obj.xSteps = (data[1]*256 + data[2]);
			obj.ySteps = (data[3] * 256 + data[4]);
			obj.xLimit = (data[5] * 256 + data[6]);
			obj.yLimit = (data[7] * 256 + data[8]);
			obj.state = data[16];
			dlog.info(obj);
		}
		Driver.ProcessMessage(obj);
	};
	
	Driver.Disconnected = function(){
		Driver.Connected = false;
		dlog.info("Socket disconnected");		
		setTimeout(Driver.Init, 10000);
	};
	
	Driver.Poll = function(){
		if (Driver.State == "connected"){
			Driver.State = "polling";
			try{
				Driver.socket.write("\0");
				Driver.State = "connected";
			}
			catch (e){
				log.debug("Polling error");
				Driver.socket.end();
			}
		}
	};
	
	Driver.Close = function(){
		log.info("Driver Closing");
		dlog.info("Driver Closing");
		if (Driver.Connected && Driver.socket){
			Driver.socket.end();
			Driver.socket.destroy();
		}
	};
	
	
	Driver.ProcessMessage = function(obj){
		Driver.LastDeviceState = obj;
		if (Server.OnDeviceMessage){
			Server.OnDeviceMessage(obj);
		}
		if (Driver.OnMessage){
			Driver.OnMessage(obj);
		}
	};
	
	Driver.SendCommand = function(data){
		log.info("sending: " + JSON.stringify(data));
		var bytes = [];
		if (!data || !data.command){
			log.error("sending incorrect: " + JSON.stringify(data));
			return;
		}
		bytes[0] = data.command;
		if (!isNaN(parseInt(data.x))){
			bytes[1] = (parseInt(data.x) / 256);
			bytes[2] = (parseInt(data.x) % 256);
		}
		if (!isNaN(parseInt(data.y))){
			bytes[3] = (parseInt(data.y) / 256);
			bytes[4] = (parseInt(data.y) % 256);
		}
		if (!isNaN(parseInt(data.speed))){
			bytes[5] = (parseInt(data.speed) / 256);            
			bytes[6] = (parseInt(data.speed) % 256);            
		}
		Driver.socket.write(new Buffer(bytes));
	};
	
	
	Driver.SendStateCommand = function(data){
		Driver.SendCommand({command:4});
	};
	
	
	Driver.SendStopCommand = function(data){
		log.info("Stop");
		Driver.Program = null;
		Driver.SendCommand({command:3});
	};
	
	Driver.RunProgram = function(data){
		if (data.length <= 0) return;
		log.info("Program " + data.length);
		dlog.info("Program "  + data.length);
		Driver.Program = data;  
		Driver.CurrentIndex = 0;
		Driver.OnMessage = Driver.NextLine;
		Driver.GoLine();
	};
	
	Driver.GoLine = function(message){
		if (!Driver.Program) return;
		if (Driver.CurrentIndex >= Driver.Program.length) {
			dlog.info("Program complete " + Driver.CurrentIndex);
			log.info("Program complete " + Driver.CurrentIndex);
			Driver.OnMessage = null;
			return;
		}
		dlog.info("Line " + Driver.CurrentIndex);
		log.info("Line " + Driver.CurrentIndex);
		Driver.SendCommand(Driver.Program[Driver.CurrentIndex]);
	};
	
	Driver.NextLine = function(message){
		if (!Driver.Program) return;
		if (Driver.CurrentIndex >= Driver.Program.length){ 
			dlog.info("Program complete " + Driver.CurrentIndex);
			log.info("Program complete " + Driver.CurrentIndex);
			Driver.OnMessage = null;
			return;
		}
		Driver.CurrentIndex++;
		Driver.GoLine();
	};
	
	
	
	Server = server = {};
	
	Server.Utilisation = function(context){
		
		
	};
	
	Server.SendCommand = function(data){
		Device.SendCommand();
	};
	
	Server.MainRouter = function(context){
		fs.readFile("./main/CncTable.htm", function(err, result){
			if (err){
				context.res.setHeader("Content-Type", "text/plain; charset=utf-8");
				context.finish(200,  "Klab server v. " + Server.Config.ver);
				return;
			}
			context.res.setHeader("Content-Type", "	text/html; charset=utf-8");
			//result = (result+"").replace("<div id='serverVer'></div>", "<div id='serverVer'>" + Server.Config.ver +  "</div>");
			context.finish(200, result);
			context.continue();
		});	
		
		return false;
	};
	
	
	Server.Init = function(){
		var cfg = { path : "/", dbpath: "127.0.0.1:20000", dbname : "klab", port:808, mode: 'master', ver : "1.2.4", cncPort : 12100 };
		
		Server.RootPath = "";
		/*
fs.readFile("Config.json", function(err, result){
if (!err && result){
result = JSON.parse(result);
if (!err && result){
for (var item in result){
cfg[item] = result[item];	
}
}	
}
});	
*/
		
		
		if (typeof(cfg.dbpath) == 'string'){
			var hp = cfg.dbpath.split(':');
			cfg.dbpath = [{host: hp[0], port:parseInt(hp[1])}];		
		}
		
		replicaSet(cfg.dbpath, cfg.dbname, function(error, database){
			if (error){
				throw error;	
			}
			var dblogs = require("./DBLogs.js");
			dlog = new dblogs(database, cfg.path, "logs");
			db = Server.Database = database;			
			Server.Config = cfg;
			Driver.Init(cfg);
			Server.Start(cfg);
		});
	};
	
	Server.Process = function(req, res){
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
		
		try{
			var context = Server.Router.GetContext(req, res, Server.Config.Path);
			Server.Router.Process(context);	
		}
		catch (e){
			log.error(e);
			if (context){
				context.error(e);
			}
			else{
				console.log(e);
			}
		}
	};
	
	Server.Start = function(config){
		var router = Server.Router = RouterModule;
		var server = http.createServer(Server.Process);
		Server.Config = config;
		if (config.mode == "master"){
			router.map("authorization");		
		}
		router.map("mainMap", 
				   {
					   "/": Server.MainRouter,
					   "/store/>": require("./DBProc.js")({collection: "storage"}, Server),
					   "/files/>": require("./Files.js")({}, Server),
					   "/logs/>": require("./DBProc.js")({collection: "logs"}, Server),
					   "<": Server.Utilisation
				   });
		
		log.info("Listening " +  config.host + ":" + config.port + "");
		io = require('socket.io').listen(server);
		if (config.host){
			server.listen(config.port, config.host);
		}
		else{
			server.listen(config.port);	
		}
		io.sockets.on('connection', function (socket) {
			log.info("Client connected");
			if (Driver.LastDeviceState){
				socket.emit('device-message', Driver.LastDeviceState);
			}
			else{
				socket.emit('device-message', "Not connected");
			}
			Server.OnDeviceMessage = function(message){
				socket.emit('device-message', message);
			};
			socket.on('send-command', Driver.SendCommand);
			socket.on('stop', Driver.SendStopCommand);
			socket.on('state', Driver.SendStateCommand);
			socket.on('program', Driver.RunProgram);
		});
	};
	
	
	process.on('exit', function(){
		log.info("Finishing program");
		Driver.Close();
	});
	
	process.on('message', function(message){
		if (message == "close" || message == "exit"){
			process.exit();
		}
	});
	
	Server.Init();
	
	
	
	
} catch(err){
	log.error(err);
	process.exit();
}