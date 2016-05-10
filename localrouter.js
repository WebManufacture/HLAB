var fs = require("fs")
    ,tty = require("tty")
	,_ = require("underscore");


function init(){

	
}

function start(){

}

function stop(){

}

function search(){
	var devices = fs.readdirSync("/dev");
	devices = _.filter(devices, function(dev){ return dev.indexOf("ttyU")  == 0; });
	console.log(devices)
}

function open(portName){
	var StringDecoder = require('string_decoder').StringDecoder;
	var decoder = new StringDecoder('utf8');

	var input = new tty.ReadStream(fs.openSync(portName, "r") );
	input.setRawMode(false);

	var output = new tty.WriteStream(fs.openSync(portName, "w") );
	console.log("READING START! " + portName);
	input.on("data", function(chunk) {
	    
	});
}

function close(){
    console.log("Closing file...");
    input.end();
}

search();

process.on("exit", stop);
