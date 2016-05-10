var Url = require('url');
var fs = require('fs');
var Path = require('path');

var WebSocketServer = new require('ws');
var webSocketServer = new WebSocketServer.Server({
  port: 6500
});
webSocketServer.on('connection', function(ws) {

  var id = Math.random();
  clients[id] = ws;
  console.log("новое соединение " + id);

  ws.on('message', function(message) {
    console.log('получено сообщение ' + message);

    for (var key in clients) {
      clients[key].send(message);
    }
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });

});



var uart = require(Path.resolve('Uart.js'));
var cnc = require(Path.resolve('cnc.js'));
//require(Path.resolve('./HLAB/Modules/UartUsb.js'));

var TTY_NAME = process.argv[2];
console.log("Connecting--- " + TTY_NAME);
try{
var port = uart.open(TTY_NAME, function(data){
	try{
		var obj = MotorPacket.FromBuffer(data);
		console.log(obj);
	}
	catch(e){
		console.error(e);
	}
});

var packet = new MotorPacket(5, 06);
packet.y = 1500;
packet.speed = 2200;

//port(packet.serialize());
}
catch(Err){
   console.error(Err);
}
setTimeout(function(){port.close(); io.close();}, 200000); 
