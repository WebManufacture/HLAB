var Url = require('url');
var fs = require('fs');
var Path = require('path');
ObjectID = require('mongodb').ObjectID;
var edge = require('edge');

require(Path.resolve("./ILAB/Modules/Utils.js"));
require(Path.resolve("./ILAB/Modules/Channels.js"));
require(Path.resolve('./ILAB/Modules/Logger.js'));
var fileSystem = require(Path.resolve('./ILAB/Modules/Files.js'));
require(Path.resolve('./ILAB/Modules/Mongo.js'));
//var UartUsb = require(Path.resolve('./HLAB/Modules/Uart.js'));
require(Path.resolve('./HLAB/Modules/UartTcp.js'));
//require(Path.resolve('./HLAB/Modules/UartUsb.js'));

Server = server = {};

require(Path.resolve('./HLAB/CncController/cnc.js'));

Server.InitDB = function (){
	debug("connecting DB");
	if (Server.Config.DB){
		if (!Server.Config.DbHost) Server.Config.DbHost = "127.0.0.1";
		if (!Server.Config.DbPort) Server.Config.DbPort = 20000;
		replicaSet([{host: Server.Config.DbHost, port : Server.Config.DbPort}], Server.Config.DB, function(err, database){
			if (err){
				error(err);	
			}
			global.db = database;
		});
	}
};

Uart = {};

Uart.Command = function(packet){
	Channels.emit("uart.output", packet.serialize());
	return packet;
};

Uart.SimpleCommand = function(command){
	command = new MotorPacket(command);
	Channels.emit("uart.output", command.serialize());
	return command;
};

Server.Init = function(config, router){
	Server.Config = config;
	Server.Device = config.DeviceCfg;
	//Server.InitDB();
	Uart.client = new UartTCP("uart", Server.Device);
	router.for("Main", "/storage/>", new fileSystem({basepath: "storage"}));
	router.for("Main", "/cnc/>", new fileSystem({basepath: "storage/cnc"}));
	router.for("Main", "/configs/>", new fileSystem({basepath: "storage/configs"}));
	router.for("Main", "/state/>", function(context){ 
		Uart.SimpleCommand(Commands.State);
		context.finish(200, result);
		return true;
	});	
	router.for("Main", "/program/>", function(context){ 
		console.log(context.data);
		var data = JSON.parse(context.data);
		if (Server.program){
			Server.program.close();	
		}
		Server.program = new CncProgram(data, Uart);
		Server.program.Start();
		context.finish(200, data.length);
		return true;
	});		
	router.for("Main", "/command/>", function(context){ 
		var data = JSON.parse(context.data);
		console.log(data);
		if (data.command == Commands.Stop && Server.program){
			console.log(Stopping);
			Server.program.Stop();
		}
		Uart.Command(data)
		context.finish(200, data);
		return true;
	});
};

module.exports = Server;

