Serial = function(){
	var SerialPort = require("serialport").SerialPort;			
	return SerialPort;
}

Serial.getDevices = function(callback){
		var usb = require('usb');		
		var devList = {};
		
		/*
	
		function setDescriptor(dev) {
			var id = FormatNumberLength(dev.deviceDescriptor.idVendor.toString(16),4) + "_" + FormatNumberLength(dev.deviceDescriptor.idProduct.toString(16),4);
			dev.getStringDescriptor(0, function(descr){
				devList[id.toUpperCase()] = descr;
			});
		}

		function FormatNumberLength(r, length) {
			while (r.length < length) {
				r = "0" + r;
			}
			return r;
		}	
	
		var list = usb.getDeviceList();
		list.forEach(function(dev) {
			setDescriptor(dev);				
		});
		*/
		
		require("serialport").list(function (err, ports) {
		  ports.forEach(function(port) {
			//if (port.pnpId.start("USB\\") || port.pnpId.start("FTDIBUS\\")){
			{
				var p = {
					port : port.comName,
					vendor : port.manufacturer,
					vid : port.pnpId.match(/VID_(\w+)/),
					pid : port.pnpId.match(/PID_(\w+)/),
				}
				p.vid = p.vid ? p.vid[1] : null;
				p.pid = p.pid ? p.pid[1] : null;
				devList[p.port] = p;
			}
		  });
		  if (typeof callback == "function") callback(devList);
		});
	};