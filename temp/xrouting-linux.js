var fs = require("fs")
    ,tty = require("tty");


function init(){

}

function start(){

}

function stop(){

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

process.on("exit", stop);

