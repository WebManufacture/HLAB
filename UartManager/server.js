var io = require('socket.io');
var http = require('http');
var app = http.createServer().listen(8080);
var SerialPort = require("serialport").SerialPort;
var io = io.listen(app);
var EventEmitter = require('events').EventEmitter;

var ports = {};
var counters = {};
var mediator = new EventEmitter(); 

function getPorts(callback){
    require("serialport").list(function (err, ports) {
	    if (typeof callback == "function") callback(ports);   
	});
}

app.on("request", function(req, res){
    
	getPorts(function(ports){
	    
	   res.setHeader("content-type", "text/json");
       res.setHeader("Access-Control-Allow-Headers", "debug-mode,origin,content-type");
       res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, PUT, POST, HEAD, OPTIONS, SEARCH");
       res.setHeader("Access-Control-Allow-Origin", "*");
	    res.statusCode = 200;
	   res.end(JSON.stringify(ports));
	})
});

getPorts(function(ports){
    console.log(ports);
});

function OpenPort(portName){
    if (!ports[portName]){
        var serialport = ports[portName] = new SerialPort("/dev/" + portName);
        serialport.on('error', function(err){
           console.log(portName + '>> Serial Port error:');
           console.error(err)
           ports[portName] = null;  
        });
        serialport.on('open', function(){
            counters[portName] = 1;
            console.log(portName + '>> Serial Port Opened');
            serialport.on("data", function(data){
               mediator.emit("/" + portName + "/from", data);
            });
            serialport.on('close', function(){
               ports[portName] = null; 
               mediator.emit("/" + portName + "/closed", portName);
               mediator.emit("port-closed", portName);
               mediator.removeListener("/" + portName + "/disconnect", onDisconnect);
               mediator.removeListener("/" + portName + "/to", onPortDataSend);
            });
            function onDisconnect(){
                counters[portName]--;
                if (counters[portName] <= 0){
                    serialport.close();
                }
            };
            function onPortDataSend(data){
                serialport.send(data);
            };
            mediator.once("/" + portName + "/close", function onCloseCommand(){
                serialport.close();
            });
            mediator.on("/" + portName + "/disconnect", onDisconnect);
            mediator.on("/" + portName + "/to", onPortDataSend);
        });
        return serialport;
    }
    counters[portName]++;
    return serialport;
}

io.sockets.on('connection', function (socket) {
    var port = '';
	if (socket.namespace){
		port += socket.namespace.name;
	}
	console.log(port + ">> Socket connected");
	OpenPort(port);
    socket.on('send-data', function (data) {
        console.log(data);
        mediator.emit("/" + port + "/to", data)
    });
    socket.on('port-close', function (data) {
        console.log("Try to close port " + port);
        mediator.emit("/" + port + "/close", data)
    });
    function onPortClosed(){
        socket.emit("port-closed");
        socket.conn.close();
    };
    function onPortData(data){
        socket.emit("port-data");
    };
    mediator.once("/" + portName + "/closed", onPortClosed);
    mediator.on("/" + portName + "/from", onPortData);
    
    socket.on('disconnect', function () {
        console.log(port + '>> disconnected');
        mediator.emit("/" + portName + "/disconnected");
        mediator.removeListener("/" + portName + "/from", onPortData);
    });
});
