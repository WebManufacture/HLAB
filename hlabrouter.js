var http = require('http');
var Url = require('url');
var fs = require('fs');
var Path = require('path');

require(Path.resolve("./ILAB/Modules/Utils.js"));
require(Path.resolve("./ILAB/Modules/Channels.js"));
require(Path.resolve("./ILAB/Modules/ChildProcess.js"));
var Files = require(Path.resolve("./ILAB/Modules/Files.js"));
require(Path.resolve('./ILAB/Modules/Logger.js'));
require(Path.resolve('./ILAB/Modules/Async.js'));
var Storage = require(Path.resolve("./ILAB/Modules/Storage.js"));
	
function NetRouter(cfg){
	
}

NetRouter.prototype = {
	
}

function HLabRouter(config){
	this.devices = {};
	console.log("HLab config:");
	console.log(config);
	this.netRouter = new NetRouter(config.Net);
}

HLabRouter.prototype = {

	getDevices : function(){
		return this.getDevices();	
	},
	
	Start : function(server){
		
		
		/*
		var netServer = this.NetServer = Net.createServer(function(client) { //'connection' listener
			try{
				var clientId;// = (Math.random() + "").replace("0.", "");
				//netClients[clientId] = client;
				logger.log('client connected: ' + clientId + " " + client.remoteAddress + ":" + client.remotePort);
				client.on('error', function(err) {
					logger.error(err);
				});
				client.on('end', function() {
					try{
						if (clientId){
							delete netClients[clientId];
							Channels.emit("/HLAB/XROUTING/" + clientId + ".disconnected", clientId);
						}
						
						delete me.AvailableConfigs[clientId];
						logger.log('client disconnected: ' + clientId);
					}
					catch(err){
						logger.error(err);
					}
				});		
				client.setEncoding('utf8');
				client.once('data', function(cfg){
					clientId = me.NetClientConnected(cfg, client);
					me.ConnectedPorts[clientId] = client;
				});
			}
			catch(err){
				logger.log("HLAB>> Problem with a net socket:");
				logger.error(err);
			}
		});
		netServer.listen(4000, function() { //'listening' listener
			logger.log('NET Server bound: ' + 4000);
		});
		this.SockServer = useSystem('socket.io')(9013);
		this.SockServer.on('error', function(err){
			logger.log(">>>HLAB socket server error: ");
			logger.error(err);
		});
		this.SockServer.on('connection', function (socket) {
			try{
				/*var path = '/';
				if (socket.namespace){
					path += socket.namespace.name;
				}
				var nc = me.netClients[socket.namespace.name];
				if (!nc){
					socket.end("No net clients with id: " + socket.namespace.name);
				}
			    var clientId = (Math.random() + "").replace("0.", "");
				logger.log(">>>HLAB socket connected: " + clientId);
				me.ConnectedClients[clientId] = socket;
				socket.on('error', function (err) {
					logger.log(">>>HLAB socket server error: " + path);
					logger.error(err);
				});
				var handler = function(data, arg){
					socket.emit('message', [data, arg]);
				}			
				Channels.on("/HLAB/XROUTER/*.in", handler);	
				Channels.on("/HLAB/XROUTER/IN", handler);		
				socket.on('disconnect', function (socket) {
					delete me.ConnectedClients[clientId];
				});	
				socket.on("message", function(message, data){
					logger.log(message);
					var dst = message.dst;
					Channels.emit("/HLAB/XROUTER/" + dst + ".out", message.data);
				});
			}
			catch(err){
				logger.log("HLAB>> Problem with a WS client:");
				logger.error(err);
			}
		});			
		logger.log(">>>HLAB socket server: " + 9013);*/
	},

	Stop : function(){			
		this.logger.log("HLAB server stopping");
		XRouter.Stop();
		/*try{
			r netClients = this.ConnectedPorts;
			var clients = this.ConnectedClients;
			for (var cid in clients){
				if (clients[cid]){
					clients[cid].end("Server stopping!");
				}
			}
			for (var cid in netClients){
				if (clients[cid]){
					netClients[cid].end("Server stopping!");
				}
			}
			if (this.NetServer){
				this.NetServer.close();
				this.NetServer = null;
			}		
			if (this.SockServer){
				this.SockServer.close();
				this.SockServer = null;
			}		
		}
		catch(err){
			this.logger.error("Error stopping HLAB server:");
			this.logger.error(err);
		}*/
	},
	
	NetClientConnected : function(cfg, client){
		try{
			var me = this;
			if ((cfg + "").length != 9){
				console.error("unknown config " + cfg);
				//return;
			}			
			var cid = cfg;			
			//var client = ;
			client.on('data', function(data){
				me.NetClientData(data, cid);
			});
			Channels.emit("/HLAB/XROUTER/" + cid + ".connected", cfg);
			Channels.on("/HLAB/XROUTER/" + cid + ".out", function(msg, data){
				client.send(data);
			});
			return cfg;
			/*this.logger.log(cfg);
			var res = { };
			var sr = cfg.Serials;
			for (var i = 0; i < sr.length; i++){
				if (sr[i]) res[sr[i]] = null;
			}
			for (var i = 0; i < cfg.Configs.length; i++){
				var line = cfg.Configs[i];
				if (!res[line.PortName]) res[line.PortName] = line;
				this.logger.log(line.PortName + " " + line.Speed + " " + line.RxPacketType);
			}			 
			this.AvailableConfigs[cid] = {ServerId : cfg.ServerId, Ports : res, Addr : client.remoteAddress + ":" + client.remotePort};
			*/
		}
		catch(err){
			this.logger.log("Unknown client: " + cid);
			this.logger.error(err);
		}
	},

	NetClientData : function(data, cid){
		try{			
			console.log(data);
			//data = JSON.parse(data);
			Channels.emit("/HLAB/XROUTER/" + cid + ".in", data);
			Channels.emit("/HLAB/XROUTER/IN", data);
		}
		catch(err){
			console.error(err);
		}
	}
}
module.exports = HLabRouter;