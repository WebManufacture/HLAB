var http = require('http');
var Url = require('url');
var fs = require('fs');
var Path = require('path');
var ChildProcess = require('child_process');
var Net = require('net');
require(Path.resolve("./ILAB/Modules/Utils.js"));
var Files = require(Path.resolve("./ILAB/Modules/Files.js"));

HLabServer = function(config, router, logger){
	try{
		this.Config = config;
		this.noCollectData = true;
		this.logger = logger = console;
		this.AvailableConfigs = {};
		var clients = this.ConnectedClients = {};
		var me = this;
		var server = Net.createServer(function(client) { //'connection' listener
			var clientId = (Math.random() + "").replace("0.", "");
			logger.log('client connected: ' + clientId + " " + client.remoteAddress + ":" + client.remotePort);
			clients[clientId] = client;
			client.on('end', function() {
				delete clients[clientId];
				delete me.AvailableConfigs[clientId];
				logger.log('client disconnected: ' + clientId);
			});		
			client.setEncoding('utf8');
			client.once('data', function(cfg){
				me.NetClientConnected(cfg, clientId)
			});
		});
		server.listen(4000, function() { //'listening' listener
			logger.log('NET Server bound: ' + 4000);
		});

		var filesRouter = Files(config, this);
		router.for("Main","/>", {
			GET : function(context){
				if (context.query["action"] == "edit" || context.query["action"] == "create"){
					context.res.setHeader("Content-Type", "text/html; charset=utf-8");
					if (context.query["action"] == "create"){
						var path = context.pathName;
						if (config.basepath){
							path = config.basepath + context.pathName;
						}
						path = Path.resolve(path);
						if (!fs.existsSync(path)){
							fs.writeFileSync(path, "", null);   
						};
					}
					fs.readFile(Path.resolve("./HLAB/TextEditor.htm"), "utf8", function(err, result){   
						if (err){
							context.finish(500, "Not found files view page " + err);
							return;
						}		
						context.finish(200, result);
					});
					return false;
				}
				if (context.query["action"] == "clients"){
					context.res.setHeader("Content-Type", "text/json; charset=utf-8");
					context.finish(200, JSON.stringify(me.AvailableConfigs));
					return false;
				}
				var path = context.pathName;
				if (config.basepath){
					path = config.basepath + context.pathName;
				}
				if (path.indexOf(".") != 0){
					path = "." + path;   
				}
				path = Path.resolve(path);
				fs.stat(path, function(err, stat){
					if (err){
						if (context.query["action"] == "file"){
							fs.writeFile(path, null, null, function(err, result){ 
								context.res.setHeader("Content-Type", "text/plain; charset=utf-8");
								context.finish(200, result);
								context.continue();
							});
							return;
						}
						if(context.query["action"] == "dir"){
							fs.mkdir(path, null, function(err, result){ 
								context.res.setHeader("Content-Type", "text/plain; charset=utf-8");
								context.finish(200, result);
								context.continue();
							});
							return;
						}
						context.continue();
						return;
					}
					if (stat.isDirectory()){
						context.res.setHeader("Content-Type", "text/html; charset=utf-8");
						fs.readFile(Path.resolve("./HLAB/files.htm"), "utf8", function(err, result){   
							if (err){
								context.finish(500, "Not found files view page " + err);
								return;
							}		
							context.finish(200, result);
						});
						return;
					}
					if (stat.isFile()){
						if (Path.extname(path) == ".sm8" || Path.extname(path) == ".s19" || Path.extname(path) == ".elf"){
							context.res.setHeader("Content-Type", "application/octet-stream");
							fs.readFile(path, "binary", function(err, result){   
								if (err){
									context.finish(500, "Error while reading file " + err);
									return;
								}		
								context.finish(200, result);
							});
						}
					}
					context.continue();
				});
				return false;
			},
			PUT : function(context){
				if (context.completed) return true;
				var path = context.pathName;
				if (config.basepath){
					path = config.basepath + context.pathName;
				}
				if (path.indexOf(".") != 0){
					path = "." + path;   
				}
				var clientId = context.query["clientId"];
				var client = clients[clientId];
				var data = "";
				context.req.on("data", function(chunk){
					data += chunk;
				});
				context.req.on("end", function(){
					if (client){
						client.write(data);						
					}				   
				});
				return false;
			},			
			POST : function(context){
				if (context.completed) return true;
				var path = context.pathName;
				if (config.basepath){
					path = config.basepath + context.pathName;
				}
				if (path.indexOf(".") != 0){
					path = "." + path;   
				}
				var writeable = fs.createWriteStream(Path.resolve(path),{'flags': 'w', 'encoding': 'binary'});
				if (context.data) console.error("DATA DETECTED!");
				context.req.on("data", function(data){
					writeable.write(data);
				});
				context.req.on("end", function(){
					context.finish(200);
					context.continue();					   
				});
				return false;
			},
			DELETE : function(context){
				if (context.completed) return true;
				var path = context.pathName;
				if (config.basepath){
					path = config.basepath + context.pathName;
				}
				if (path.indexOf(".") != 0){
					path = "." + path;   
				}
				path = Path.resolve(path);
				fs.exists(path, function(exists){
					if (!exists){
						context.finish(404, "file " + path + " not found");
						return;
					}
					info("Deleting " + path);
					fs.unlink(path, function(err, result){
						if (err){
							Channels.emit("/file-system/action.delete.error", path,err);
							context.finish(500, "Delete error " + path + " " + err);	
							context.continue();
							return;
						}			
						Channels.emit("/file-system/action.delete", path);
						context.finish(200, "Deleted " + path);			
						context.continue();
					});
				});
				return false;
			}
		});
		router.for("Main","/<", filesRouter);
	}
	catch(err){
		console.log(err);
		logger.error(err);
	}
};

HLabServer.prototype = {
	NetClientConnected : function(cfg, cid){
		try{
			cfg = JSON.parse(cfg);			
			var client = this.ConnectedClients[cid];
			this.logger.log("HLAB PORTS Avalable on " + client.remoteAddress);
			this.logger.log(cfg.Serials);
			var res = { };
			var sr = cfg.Serials.split(',');
			for (var i = 0; i < sr.length; i++){
				if (sr[i]) res[sr[i]] = null;
			}
			for (var i = 0; i < cfg.Configs.length; i++){
				var line = cfg.Configs[i];
				if (!res[line.PortName]) res[line.PortName] = line;
				this.logger.log(line.PortName + " " + line.Speed);
			}			 
			this.AvailableConfigs[cid] = {ServerId : cfg.ServerId, Ports : res, Addr : client.remoteAddress + ":" + client.remotePort};
			client.on('data', function(data){
				this.NetClientData(data, cid);
			});
		}
		catch(err){
			this.logger.error(err);
		}
	},

	NetClientData : function(data, cid){
		try{			
			this.logger.log(data);
			data = JSON.parse(data);
		}
		catch(err){
			this.logger.error(err);
		}
	}
}

module.exports = function(config, router, r2, logger){
	return new HLabServer(config, router, logger);
}

