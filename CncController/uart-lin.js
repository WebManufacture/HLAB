var fs = require("fs")
,tty = require("tty")
,_ = require("underscore");



var Uart = {

	stop : function (){

	},

	search : function(){
		var devices = fs.readdirSync("/dev");
		devices = _.filter(devices, function(dev){ return dev.indexOf("ttyU")  == 0; });
		console.log(devices)
	},

	open: function(portName, callback){
		var StringDecoder = require('string_decoder').StringDecoder;
		var decoder = new StringDecoder('utf8');

		var input = new tty.ReadStream(fs.openSync("/dev/" + portName, "r") );
		input.setRawMode(true);

		var output = new tty.WriteStream(fs.openSync("/dev/" + portName, "w") );
		console.log("READING START! " + portName);
		var readState = 0;
		var pSize = 0;
		var rInd = 0;
		var rBuf = [];
		input.on("data", function(chunk) {
			for(var i = 0; i < chunk.length; i++){
				var b = chunk[i];
				switch(readState){
					case 0: 
						if (b == 1);
						readState = 1;
						rBuf = [];
						rInd = 0;
						break;
					case 1: 
						pSize = b;
						readState = 2;
						rBuf = [];
						rInd = 0;
						break;
					case 2: 
						if (rInd < pSize){
							rBuf[rInd] = b;
							rInd++;
						}
						else{
							if (callback) callback(rBuf);
							rInd = 0;
							readState = 0;
						}
						break;			
				}
			}
		});
		
		var port = function(data){
			var l = data.length;
			data.unshift(l);
			data.unshift(1);
			data.push(3);
			console.log(data);
			output.write(new Buffer(data));
		}


		port.close  = function(){
			console.log("Closing file...");
			input.end();
		}

		return port;
	},


}

module.exports = Uart;