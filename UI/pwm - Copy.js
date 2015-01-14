
WS.DOMload(function(){
	if (window.L && window.L.debug){
		DOM.all(".debug-box").show();
	}
	//device = new UartManager("ws://el-table:5000", "device");
	device = new UartManager("ws://localhost:5000", "device");
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

function SendInfo(info){
	if (info && info.length > 0){
		var data = info.split(' ');
	}
}

function Send(obj){
	var arr = [];
	if (obj){
		obj.command = parseInt(obj.command);
		arr.push(obj.command);
		if (!obj.address) obj.address = 0;
		obj.address = parseInt(obj.address);
		arr.push(getHighInt(obj.address));
		arr.push(getLowInt(obj.address));
		obj.port = parseInt(obj.port);
		arr.push(obj.port);

		if (!obj.low) obj.low = 0;
		obj.low = parseInt(obj.low);
		arr[4] = (obj.low >> 24) & 255;
		arr[5] = (obj.low >> 16) & 255;
		arr[6] = (obj.low >> 8) & 255;
		arr[7] = (obj.low) & 255;

		if (!obj.high) obj.high = 0;
		obj.high = parseInt(obj.high);
		arr[8] = (obj.high >> 24) & 255;
		arr[9] = (obj.high >> 16) & 255;
		arr[10] = (obj.high >> 8) & 255;
		arr[11] = (obj.high) & 255;
		for (var i = 0; i < arr.length; i++){
			arr[i] = parseInt(arr[i]);
			if (isNaN(arr[i])){
				throw "ERROR VALUE " + arr;
			}
		}
		Channels.emit("device.send", arr);
		return arr;
	}
	return;
}

function onCell_Selected(cell){
	cell.value = 255;
	programText.textContent = "Cell: " + cell.row + " " + cell.col + " " + cell.value;
}

function onCell_UnSelected(cell){
	cell.value = 0;
	programText.textContent = "Cell: " + cell.row + " " + cell.col + " " + cell.value;
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

function SendJSON(value){
	Send(JSON.parse(value));
}	


function SaveSettings(){
	Send({command : 2, port : dsvDivider.value, low : dsvTimerValue.value});
	DeviceSettingsWindow.Hide();
}	

function SetPort(port, value1, value2){
	Send({command : 5, port : port, low : value1, high : value2});
}

function SetPwm(port, value){
	SetPort(port, 100 - parseInt(value), parseInt(value));
}

function SetColor1(r, g, b){
	SetPwm(10, b);
	SetPwm(11, r);
	SetPwm(12, g);
}

function SetColor2(r, g, b){
	SetPwm(14, b);
	SetPwm(15, r);
	SetPwm(16, g);
}

function SetColor3(r, g, b){
	SetPwm(17, b);
	SetPwm(18, r);
	SetPwm(19, g);
}

function SetColor4(r, g, b){

	SetPwm(7, b);
	SetPwm(8, r);
	SetPwm(9, g);
}

function SetColor(r, g, b){
	StopColorShow();
	SetColor1(r, g, b);
	SetColor2(r, g, b);
	SetColor3(r, g, b);
	SetColor4(r, g, b);
}

function SetColorObj(c, num){
	if (num){
		switch(num){
			case 1: SetColor1(c.red, c.green, c.blue); break;
			case 2: SetColor2(c.red, c.green, c.blue); break;
			case 3: SetColor3(c.red, c.green, c.blue); break;
			case 4: SetColor4(c.red, c.green, c.blue); break;
		}
	}
	else{
		SetColor1(c.red, c.green, c.blue);
		SetColor2(c.red, c.green, c.blue);
		SetColor3(c.red, c.green, c.blue);
		SetColor4(c.red, c.green, c.blue);
	}
}

function SetColorNum(num){
	StopColorShow();
	num = parseInt(num);
	if (isNaN(num) || num < 0 || num >= sArr.length) return;
	SetColorObj(sArr[num]);
}

function StopColorShow(){
	if (window.sSettings1){
		sSettings1.Stop();
	}
	if (window.sSettings2){
		sSettings2.Stop();
	}
	if (window.sSettings3){
		sSettings3.Stop();
	}
	if (window.sSettings4){
		sSettings4.Stop();
	}
}

function ShowSettings(colorNum, delay)
{
	this.colorNum = colorNum;
	this.delay = delay;
	this._currentColor = 0;
	this._nextColor = 1;
	this._cColor = {red : 0, green : 0, blue: 0};
	this._rstep = 0;
	this._gstep = 0;
	this._bstep = 0;
}

ShowSettings.prototype = {
	Stop : function(){
		if (this._cShow){
			clearInterval(this._cShow);
			this._cShow = null;
		}
	}, 

	Start : function(){
		if (!this._cShow){
			this.processStep();
			this._counter = 0;
			var  self = this;
			this._cShow = setInterval(function(){
				self.onMicroStep()
			}, _speed);
		}
	}, 

	processStep : function(){
		var cc = cArr[ this._currentColor];
		var nc = cArr[ this._nextColor];		
		this._cColor = JSON.parse(JSON.stringify(cc));
		this._rstep = (nc.red - cc.red) / _steps;
		this._gstep = (nc.green - cc.green) / _steps;
		this._bstep = (nc.blue - cc.blue) / _steps;
		SetColorObj(cc, this.colorNum);
	},

	onMicroStep : function (){
		var nc = cArr[ this._nextColor];
		var cc = this._cColor;
		if (this.delay) {
			this.delay--
			return ;
		}
		cc.red += this._rstep;
		cc.green += this._gstep;
		cc.blue += this._bstep;
		//var log = DeviceLog.div(".line", JSON.stringify(cc) + " " + JSON.stringify(nc) + " " + _rstep + " " + _gstep + " " + _bstep);
		SetColorObj(cc, this.colorNum);
		if ((Math.abs(nc.red - cc.red) < Math.abs(this._rstep + 0.9)) && (Math.abs(nc.green - cc.green) < Math.abs(this._gstep + 0.9)) && (Math.abs(nc.blue - cc.blue) < Math.abs(this._bstep + 0.9))){
			this.nextStep();
		}
	},

	nextStep: function (){
		this._rcounter = 0;
		this._gcounter = 0;
		this._bcounter = 0;	
		this._rstep = 0;
		this._gstep = 0;
		this._bstep = 0;		
		this._nextColor++;
		this._currentColor++;
		if ( this._nextColor >= cArr.length)  this._nextColor = 0;
		if ( this._currentColor >= cArr.length)  this._currentColor = 0;		
		this.processStep();
	}
}

function StartColorShow(){
	StopColorShow();
	_steps = 32;
	_speed = 100;
	sSettings1 = new ShowSettings(1, 0);
	sSettings1.Start();
	sSettings2 = new ShowSettings(2, 40);
	sSettings2.Start();
	sSettings3 = new ShowSettings(3, 80);
	sSettings3.Start();
	//sSettings4 = new ShowSettings(4, 0);
	//sSettings4.start();
}

cArr = [
	{ red : 0, green : 0, blue : 0},
	{ red : 100, green : 0, blue : 0},
	{ red : 100, green : 0, blue : 100},
	{ red : 0, green : 0, blue : 100},
	{ red : 0, green : 100, blue : 100},
	{ red : 0, green : 100, blue : 0},	
	{ red : 100, green : 100, blue : 0},
	{ red : 100, green : 0, blue : 0},
	{ red : 0, green : 0, blue : 100},
	{ red : 0, green : 100, blue :0},
	{ red : 100, green : 0, blue : 0},
	{ red : 0, green : 100, blue : 0},
	{ red : 0, green : 0, blue : 100},
	{ red : 100, green : 0, blue : 100},
	{ red : 100, green : 100, blue : 0},
]
	
sArr = [
	{ red : 100, green : 0, blue : 0},     //K
	{ red : 100, green : 50, blue : 0},   //
	{ red : 100, green : 75, blue : 0},//О
	{ red : 100, green : 88, blue : 0},//
	{ red : 100, green : 100, blue : 0},	//Ж
	{ red : 80, green : 100, blue : 0},//
	{ red : 50, green : 100, blue : 0},//З
	{ red : 0, green : 100, blue : 0},//
	{ red : 0, green : 100, blue :80},//Г
	{ red : 0, green : 100, blue : 100},//
	{ red : 0, green : 70, blue : 100},//С
	{ red : 0, green : 40, blue : 100},//
	{ red : 0, green : 0, blue : 100},//Ф
	{ red : 60, green : 0, blue : 100},//
	{ red : 100, green : 0, blue : 100},//
	{ red : 100, green : 0, blue : 50},//
]
