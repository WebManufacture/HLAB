window.onerror = function(re, e){
	//document.body.textContent = JSON.stringify(e);
	//alert(re);	
}



WS.DOMload(function(){
	if (window.L && window.L.debug){
		DOM.all(".debug-box").show();
	}
	//device = new UartManager("ws://el-table:5000", "device");
	//device = new UartManager("ws://localhost:5000", "device");
	var packageCollector = [];
	var packageTimeout = null;
	function FlushData(){
		Net.POST("http://localhost:5001", JSON.stringify(packageCollector), function(){

		})		
		packageCollector = [];
		if (packageTimeout) clearTimeout(packageTimeout);
		packageTimeout = null;
	};
	/*
	Channels.on("device.send", function(data){
		if (!packageTimeout){
			packageTimeout = setTimeout(FlushData, 500);
		}
		else{
			packageCollector.push(data);
			if (packageCollector.length > 20) FlushData();
		}
	});*/

	Channels.on("device.mirrored", function(data){
		DeviceLog.div(".line.info.output", data);
	});
	Channels.on("device.received", function(data){
		var pack = parsePacket(data);
		if (pack){
			if (pack.isSettings){
				var log = DeviceLog.div(".line.device-settings", "Device settings   Divider: ");
				log.div('.division', pack.division);
				log.div('', " Counter: ");
				log.div('.timer', pack.timer);
			}
		}
		else{
			DeviceLog.div(".line.info.input", data);
		}
	});
	var cBtns = DOM.all('.color-btn');
	for (var i = 0; i < cBtns.length; i++){
		var color = sArr[i];
		var cBtn = cBtns[i];
		if (color){
			cBtn.style.backgroundColor = "rgb(" + parseInt(color.red*255/100) + ", " + parseInt(color.green*255/100) + ", " + parseInt(color.blue*255/100) + ")";
		}
	}
});

function SettingsData(data){
	this.isSettings = true;
	this.command = data[0];
	this.address = getInt(data, 1);
	this.division = data[3];				
	this.low = getLong(data, 4);
	this.high = getLong(data, 8);
	this.timer = (this.high << 8) + this.low;
}

function PwmData(data){
	this.command = data[0];
	this.address = getInt(data, 1);
	this.port = data[3];
	this.low = getLong(data, 4);
	this.high = getLong(data, 8);
}

function CheckSettings(){
	Channels.emit("device.send", [01]);
};

function parsePacket(data){
	if (!data || data.length != 12) return null;
	if (data[0] == 0 || data[0] == 1)
	{
		return new SettingsData(data);
	}
	else
	{
		return new PwmData(data);
	}
}

function getInt(data, index){
	return (data[index] << 8) + data[index+1];	
}

function getLong(data, index){
	return (data[index] << 24) + (data[index + 1] << 16) + (data[index + 2] << 8) + data[index+3];	
}

function getLowInt(data){
	return data & 255;	
}

function getHighInt(data, index){
	return (data >> 8) & 255;
}

function Send(command, obj){
	SendJSON(command, JSON.stringify(obj));
}

function ShowSettings(){
	Channels.once("device.received", function(data){
		var settings = parsePacket(data);
		if (settings && settings.isSettings){
			dsvDivider.value = settings.division;
			dsvTimerValue.value = settings.timer;
			DeviceSettingsWindow.Show();
		}});
	CheckSettings();
}	

function SendJSON(command, value){
	try{
		Net.POST("http://web-manufacture.net:5000?command=" + command, value, function(data){
		});
	}
	catch(e){
		alert("NET: " + e);
	}
}	


function SaveSettings(){
	Send({command : 2, port : dsvDivider.value, low : dsvTimerValue.value});
	DeviceSettingsWindow.Hide();
}	

function SetColor(num){
	if (typeof(num) == 'number'){
		var c = sArr[num];
	}
	if (typeof(num) == 'object'){
		var c = num;	
	}
	if (c){
		Send("SetColor", c)
	}
}

function MotorMode1(){
	SetMotor(0,10);
}


function SetMotorObj(obj){
	Send("SetMotor", obj);
}

function SetMotor(i, j){
	var e = { en: arguments.length > 0, speed: 200, dir: "vibro", amp: 0x202};
	if (i == j){
		e.speed = i;
		e.dir = "vibro";
		e.amp = 0x1602;
	}
	else{
		if (i < j) {
			e.speed = j;
			e.dir = true;
		}
		else  {
			e.speed = i;
			e.dir = false;
		}
	}
	SetMotorObj(e);
}

function SetColorNum(num){
	return SetColor(num);
}

function StopColorShow(){
	Send("StopColorShow", {});
}

function StartColorShow(){
	Send("StartColorShow", {speed: 200});
	SetMotor(80, 80);
}

sArr = [
	{ red : 0, green : 0, blue : 0},     //K
	{ red : 90, green : 0, blue : 100},   //
	{ red : 100, green : 0, blue : 60},//О
	{ red : 100, green : 0, blue : 0},//
	
	{ red : 100, green : 30, blue : 0},	//Ж
	
	{ red : 100, green : 70, blue : 0},//
	{ red : 90, green : 100, blue : 0},//З
	{ red : 30, green : 100, blue : 0},//
	{ red : 0, green : 100, blue : 30},//Г
	{ red : 0, green : 100, blue : 100},//
	{ red : 0, green : 50, blue : 100},//С
	{ red : 0, green : 0, blue : 100},//
	{ red : 60, green : 0, blue : 100},//Ф
	
	{ red : 60, green : 0, blue : 100},//
	{ red : 100, green : 0, blue : 100},//
	{ red : 80, green : 0, blue : 100},//
]
