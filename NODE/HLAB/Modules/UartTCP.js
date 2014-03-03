var path = require('path');
var net = require('net');
require(path.resolve("./ILAB/Modules/Utils.js"));
require(path.resolve("./ILAB/Modules/Channels.js"));
require(path.resolve('./ILAB/Modules/Logger.js'));
	
global.UartTCP = function(port, tcpSetup){
	this.port = port;
	if (!tcpSetup.host) tcpSetup.host = '127.0.0.1';
	if (!tcpSetup.port) tcpSetup.port = 5000;
	this.tcpSetup = tcpSetup;//tcpSetup;
	var uart = this;
	var connectFunc = function(){
		try{
			var client = uart.tcpClient = net.connect(tcpSetup.port, tcpSetup.host, function(){
				uart.connected = true;	
				client.on('data', uart._dataPresent);
				log("Uart connected:" + tcpSetup);	
				//console.log("Uart connected:" + tcpSetup);	
			});
			client.on('error', function(err){
				error("Uart connection error: " + err + " on " + JSON.stringify(tcpSetup));	
				setTimeout(connectFunc, 3000);
			});
		}
		catch(e){
			error("Uart connection error: " + JSON.stringify(tcpSetup));	
			setTimeout(connectFunc, 3000);
		}
		
	};
	connectFunc();
	Channels.on("uart.output", function(message, data){
		if (uart.connected){
			uart.Send(data);
		}
	});
	var exitFunc = function(code){
		if (uart.connected){
			uart.tcpClient.end();
			uart.tcpClient.destroy();
		}
	};
	process.on('exit', exitFunc);
};

global.UartTCP.prototype = {	
	Send : function(data, callback){
		if (!this.connected) return;
		if (!data.length) return;
		for (var i = 0; i < data.length; i++){
			if (typeof data[i] == 'string'){
				data[i] = parseInt(data[i]);
			}			
		}
		this.tcpClient.Write(data, 'binary', function(err, result){
			if (err){
				console.log(err);
			}
			else{
				data.sended = true;	
			}
		}); 
	},
		
	_dataPresent : function(result){
		var self = this;
		if (result){
			console.log("Emmiting: "  + result);
			Channels.emit("uart.received." + self.port, result);
		};
	}
}

module.export = UartTCP;
