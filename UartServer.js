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

UartServer = {};

UartPorts = {};

UartServer.Init = function(){
	var config = Server.Config;
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
};

UartServer.Init();

}
catch(e){
	if (this.error){
		error(e);	
		process.exit();
	}
	else{
		throw(e);
	}
}