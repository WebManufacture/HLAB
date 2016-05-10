var path = require('path');
var usb = require('usb');
	
UartUsb = function(port){
	this.VID = 0x0483;
	this.PID = 0x5740;
	var uart = this;
	this.port = port;
};

usb.interfaceType = ["CONTROL", "ISOCHRONOUS", "BULK", "INTERRUPT"];

UartUsb.prototype.init = function(){
	var dev = usb.findByIds(this.VID, this.PID);
	var uart = this;
	if (dev){
		this.state = 'found';
		dev.open();
		this.intr = dev.interface(1);
		//Out - 3, in - 129;
		this.intr.claim();
		this.inEp = intr.endpoint(129);
		this.outEp = intr.endpoint(3);
		this.inEp.on('data', function(buffer){
			uart._dataPresent(buffer);
		});
		this.initialized = true;
		this.state = 'connected';
		process.on('exit', function(){
			dev.close();
		});
	}
	else{
		this.state = 'not found';
		setTimeout(function(){
			uart.init();	
		}, 1000);
		return;	
	}
};

UartUsb.prototype.Write = function(data, callback){
	if (this.initialized){
		this.outEp.transfer(data, function(error){
			if (error){
				console.log("USB: " + error);
				this.state = 'error';
			};
		});
	}
};

UartUsb.prototype._dataPresent = function(data, callback){
	var self = this;
};



