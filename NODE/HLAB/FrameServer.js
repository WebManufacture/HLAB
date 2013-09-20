var http = require('http');
var Url = require('url');
var path = require('path');
require(path.resolve("./Modules/Utils.js"));
var logger = require(path.resolve("./Modules/Logger.js"));
var RouterModule = require(path.resolve("./Modules/Router.js"));
var Files = require(path.resolve("./Modules/Files.js"));
require(path.resolve("./Modules/Channels.js"));
channelsClient = require(path.resolve("./Modules/ChannelsClient.js"));
var DBProc = require(path.resolve("./Modules/DBProc.js"));
var fs = require('fs');
var colors = require('colors');

colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'
});

var Path = process.cwd();
var mPath = Path;

Server = server = {};

Server.Logs = {};

Server.Init = function(){
	console.log(process.cwd().prompt);
	var cfg = { ver:"0.1.4", settingsFile: "settings.json", mainAppFile : "./NotApp.htm" };
	for (var i = 2; i < process.argv.length; i++){
		var arg = process.argv[i];
		var val = arg.split("=");
		if (val.length == 2){
			cfg[val[0]] = val[1];
		}
	}
	Server.Config = cfg;
	if (!fs.existsSync(cfg.settingsFile)){
		fs.writeFile(cfg.settingsFile, "", 'utf8');
	}
	var rtable = fs.readFileSync(cfg.settingsFile, 'utf8');
	rtable = JSON.parse(rtable);
	for (var item in rtable){
		Server.Config[item] = rtable[item];
	}
	console.log(Server.Config);
	setTimeout(function(){
		Server.Start(cfg);
	}, 100);
};

Server.SaveConfig = function(){
	console.log('config rewrite');
	fs.writeFileSync(Server.Config.settingsFile, JSON.stringify(Server.Config), 'utf8');
};

Server.ProcessChannel = function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, PUT, POST, HEAD, OPTIONS, SEARCH");
	res.setHeader("Access-Control-Allow-Headers", "debug-mode,origin,content-type");
	res.setHeader("Access-Control-Max-Age", "12000");
	res.setHeader("Access-Control-Expose-Headers", "content-type,debug-mode,Content-Type,ETag,Finish,ServerUrl,ManageUrl,Date,Start,Load,NodeId, NodeType");
	
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	res.setHeader("MainUrl", Server.MainUrl);
	res.setHeader("ChannelsUrl", Server.ChannelsUrl);
	if (req.method == 'OPTIONS'){
		res.statusCode = 200;
		res.end("OK");	
		return;
	}
	var url = "http://" + req.headers.host  + req.url;
	var urlStr = url;
	res.url = urlStr;
	url = Url.parse(url.toLowerCase(), true);
	if (url.hostname == Server.MainUrl){
		return Server.ProcessMain(req, res, url);
	}
	if (req.method == "GET" || req.method == "POST"){
		return HttpChannelsClient(req, res, url);
	}
	res.end(500, "Request not recognized");
};

Server.ProcessMain = function(req, res){
	var url = Url.parse(req.url);
	try{
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, PUT, POST, HEAD, OPTIONS, SEARCH");
		res.setHeader("Access-Control-Allow-Headers", "debug-mode,origin,content-type");
		res.setHeader("Access-Control-Max-Age", "12000");
		res.setHeader("Access-Control-Expose-Headers", "content-type,debug-mode,Content-Type,ETag,Finish,ServerUrl,ManageUrl,Date,Start,Load,NodeId, NodeType");
		
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.setHeader("MainUrl", Server.MainUrl);
		res.setHeader("ChannelsUrl", Server.ChannelsUrl);
		if (req.method == 'OPTIONS'){
			res.statusCode = 200;
			res.end("OK");	
			return;
		}
		var context = Server.Router.GetContext(req, res, "");
		Server.Router.Process(context);	
	}
	catch (e){
		if (context){
			context.error(e);
		}
		throw e;
	}
	return true;
};

Server.Start = function(config){
	var router = Server.Router = RouterModule;
	if (Server.Config.storagePath){
		var storageRouter = Files(Path + Server.Config.storagePath, Server.Config);
	};
	router.map("mainMap", 
	   {
		   "/": { 
			   GET: function(context){
				   console.log(context.url.hostname);
				   var app = fs.readFileSync(config.mainAppFile, 'utf8');
				   context.res.setHeader("Content-Type", "text/html; charset=utf-8");
				   context.finish(200, app, 'utf8');
				   return true;
			   }
			},
		   "/map": {
			   GET : function(context){
				   context.res.setHeader("Content-Type", "application/json; charset=utf-8");
				   context.finish(200, JSON.stringify(Server.CreateMap(router.Handlers.mainMap)));
			   }
		   },	
		   "/storage/>" : storageRouter,
		   "/<": channelsClient
	   });

	//console.log(router.Handlers.processMap)
	if (!config.Port) config.Port = 80;
	if (!config.Host) config.Host = "localhost";	
	Server.MainServer = http.createServer(Server.ProcessMain).listen(config.Port, config.Host);
	Server.MainUrl = config.Host + ":" + config.Port;	
	console.log("ILAB server v "  + Server.Config.ver);
	console.log("Listening " +  Server.MainUrl.green);
	if (config.ChannelsPort || config.ChannelsHost){
		if (!config.ChannelsPort) config.ChannelsPort = config.Port;
		if (!config.ChannelsHost) config.ChannelsHost = config.Host;
		Server.ChannelsUrl = config.ChannelsHost + ":" + config.ChannelsPort;	
		if (Server.ChannelsUrl != Server.MainUrl){
			Server.ChannelsServer = http.createServer(Server.ProcessAdmin);
			Server.ChannelsServer.listen(config.ChannelsPort, config.ChannelsHost);
			console.log("Channels " +  Server.ChannelsUrl.verbose);
		}
	}
	if (Server.Config.serverFile){
		require(path.resolve("./" + Server.Config.serverFile));
	}
};

Server.CreateMap = function(routerMapNode){
	if (!routerMapNode) return;
	var mapObj = null;
	for (var item in routerMapNode){
		if (item != "//"){
			var node = routerMapNode[item];
			if (node instanceof Array){
				if (node.length > 0) {
					if (!mapObj) mapObj = {};
					if (node.length > 1) {
						mapObj[item] = [];
						for (var i = 0; i < node.length; i++)
						{
							var to = typeof(node[i]);
							if (to == "object"){
								to = (node[i]._ModuleName ? node[i]._ModuleName : "")  + "{" 
								+ (node[0].GET ? "GET," : "")
								+ (node[0].POST ? "POST," : "")
								+ (node[0].PUT ? "PUT," : "")
								+ (node[0].DELETE ? "DEL," : "")
								+ (node[0].SEARCH ? "SRCH," : "")   
								+ (node[0].HEAD ? "HEAD," : "")
								+ (node[0].OPTIONS ? "OPTS," : "");
								to = to.trim(",") + "}";
								
							}
							if (to == "function"){
								to += " " + node[i].name;
							}
							mapObj[item].push(to);
						}
					}
					else{
						var to = typeof(node[0]);
						if (to == "object"){
							to = (node[0]._ModuleName ? node[0]._ModuleName : "")  + "{" 
							+ (node[0].GET ? "GET," : "")
							+ (node[0].POST ? "POST," : "")
							+ (node[0].PUT ? "PUT," : "")
							+ (node[0].DELETE ? "DEL," : "")
							+ (node[0].SEARCH ? "SRCH," : "")   
							+ (node[0].HEAD ? "HEAD," : "")
							+ (node[0].OPTIONS ? "OPTS," : "");
							to = to.trim(",") + "}";
							
						}
						if (to == "function"){
							to += " " + node[0].name;
						}
						mapObj[item] = to;
					}
				}
			}
			else{
				var value = Server.CreateMap(node);
				if (value){
					if (!mapObj) mapObj = {};
					mapObj[item] = value;
				}
			}
		}
	}
	return mapObj;
};


Server.CreateChannelMap = function(channel, count){
	if (!count) count = 1;
	//if (count > 10) return null;
	if (!channel) return;
	var mapObj = null;
	for (var item in channel){
		var node = channel[item];
		if (!mapObj) mapObj = {};
		if (Array.isArray(node)){
			mapObj[item] = "[" + node.length + "]";
		}
		else{
			if (typeof(node) == "object"){
				var value = Server.CreateChannelMap(node, count + 1);
				if (value){			
					mapObj[item] = value;
				}
			}
			else{
				mapObj[item] = node;
			}
		}
	}
	return mapObj;
};

process.on('SIGTERM', function() {
	for (var item in Server.Nodes){
		console.log("EXITING: " + item.info);
		Server.Nodes[item].Fork.stop();
	}
});

process.on('exit',function(){
	for (var item in Server.Nodes){
		console.log("EXITING: " + item.info);
		Server.Nodes[item].Fork.stop();
	}
});

Server.Init();