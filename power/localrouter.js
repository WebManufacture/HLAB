var net = require('net');
var EventEmitter = require('events').EventEmitter;
var io = require('socket.io')(8050);
var http = require('http');
var fs = require('fs');

var server = new EventEmitter();
var timeRefresh = 3000; // for Interval

var HOST = '127.0.0.1';
var PORT = 18020;

var array = [];

//var tok1 = [];
//var tok2 = [];
//var napriag1 = [];
//var napriag2 = [];

var t1 = [];
var t2 = [];
var n1 = [];
var n2 = [];

// http server
http.createServer(function(req, res){
    if(req.method == "GET" && req.url == "/"){
        res.writeHead(200, {'Content-type': 'text/html'});
        fs.createReadStream('./index.html').pipe(res);
    } else{
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write('Error 404: Page not found!');
        res.end();
    }
}).listen(3000, HOST, function(){
    console.log('http server created on port 3000');
});

// net server
net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        console.log(data.toString());
        //
        var tmp = [];

        // convert measure
        tmp = toByte(data.toString());

        t1.push(tmp[0]);
        t2.push(tmp[1]);
        n1.push(tmp[2]);
        n2.push(tmp[3]);
        //server.emit('measure', data);
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

// logic
function middleValue(arr){
    var value = 0;

    if(arr.length == 0) return 0;

    for (var i = 0; i < arr.length; i++) {
        value += arr[i];
    }

    return parseFloat( (value / arr.length).toFixed(2) );
}

function zeroing(){
    //tok1 = [];
    //tok2 = [];
    //napriag1 = [];
    //napriag2 = [];

    t1 = [];
    t2 = [];
    n1 = [];
    n2 = [];
}

function toByte(str){
    var arr = str.split(',', 4);

    var bytes = [];

    for(var i = 0; i < arr.length; i++){
        bytes.push(parseFloat(arr[i]));
    }

    return bytes;
}

// socket.io
io.on('connection', function(socket){
    console.log('connected');
/*
    server.on("measure", function(measure){
        // arrays local
        var tmp = [];

        // convert measure
        tmp = toByte(measure);

        t1.push(tmp[0]);
        t2.push(tmp[1]);
        n1.push(tmp[2]);
        n2.push(tmp[3]);
    });
*/

    setInterval(function(){
        // push data
        // socket.emit();
        var val = [middleValue(t1), middleValue(t2), middleValue(n1), middleValue(n2)];
        socket.emit('data', val );

        zeroing();
    }, timeRefresh);

    socket.on('disconnect', function(){
        console.log('disconnected');
    });
});