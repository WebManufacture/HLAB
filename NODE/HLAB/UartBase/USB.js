var usb = require('usb');

var dev = usb.findByIds(0x0483, 0x5740);
if (dev){
	console.log(dev);
	dev.open();
}

tt = ["CONTROL", "ISOCHRONOUS", "BULK", "INTERRUPT"];

var intr = dev.interface(1);

//Out - 3, in - 129;
intr.claim();

var inEp = intr.endpoint(129);
var outEp = intr.endpoint(3);

inEp.on('data', function(buffer){
	console.log("< " + buffer);
});

var mp = [0x01, 0x11, 0x12, 0x13, 1, 4, 0x1F, 0x22, 0x00, 7, 0x04];

var mr = [0x01, 0x11, 0x12, 0x13, 1, 9, 0x76, 0x1F, 0x22, 0x00, 5, 00, 00, 00, 0x0A, 0x04];


var mr2 = [0x76, 5, 00, 0, 0, 0x1A];
 

var num = [0x89, 20, 3];


outEp.transfer(mr2, function(error){
	if (error){
		console.log("E: " + error);
	};
	
	outEp.transfer(mp, function(error){
		if (error){
			console.log("E: " + error);
		}
		outEp.transfer(num, function(error){
			if (error){
				console.log("E: " + error);
			}
		})
	});
});


process.on('exit', function(){
	dev.close();
});