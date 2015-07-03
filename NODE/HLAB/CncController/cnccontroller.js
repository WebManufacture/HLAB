//alert("AAAA!");

Compilers = {};

function RegisterCompiler(type, compiler){
	Compilers[type] = compiler;
}
var CNC = {};

CNC.Commands = ["unknown", "go", "rebase", "stop", "info", "move", "pause", "resume"];
CNC.CommandsShort = ['N', 'G', 'B', 'S', 'I', 'M', 'P', 'R'];
CNC.GCommands = { "G": 1, "S": 3, "B": 2, "I": 4, "M" : 5, "P": 6, 'R': 7, 'X' : 1, 'Y': 1, 'Z': 1 };
CNC.QPrograms = {};

CNC.CommandType =
	{
	unknown: 0,
	go: 1,
	rebase: 2,
	stop: 3,
	state: 4,
	move: 5,
	pause: 6,
	resume: 7,
	error: 16
}

CNC.ProgramState =
	{
	NotStarted: 0,
	Running: 1,
	Paused: 2,
	Completed: 3,
	Aborted: 4
}

function CncController(name, connector){
	this.Name = name;
	this.configStorage = Net.GetTunnel("storage/configs/" + name + "/");
	this._super();
}

Inherit(CncController, EventEmitter,{
	Init : function (settings) {
		var ws = this.Device = new WebSocketProvider(settings);
		ws.on("state", CreateClosure(this.StateReturned, this));
		ws.on("connect", CreateClosure(this.GetCncState, this));
		if (!settings) return;
		L.debug = true;
		this.log = L.Log;
		this.id = settings.id;
		this.Settings = settings;
		this.startDate = new Date();
		lx = 0;
		ly = 0;
		lz = 0;
		this.ProgramRunned = false;
		this.DebugMode = false;
		this.ProgramCode;

		/*
		MessagesChannel = new HttpChannel(new Url(CNC.Settings.MessagesUrl), false);
		MessagesChannel.onRead.subscribe(function (message) {
			if (message.length >= 1) {
				var message = message[0];
				var path = message.source;
				if (path){
					path = path.split("/");
				}
				var type = "uart.device";// path[path.length - 1];
				if (message) {
					CNC.StateReturned(type, message);
				}
			}
		});
		MessagesChannel.connectRead();
		*/
	},

	/*
public byte command;
public ushort? x;
public ushort? y;
public ushort? z;
public ushort? speed;
public int? programLine;
*/

	GetCncState : function () {
		this.Device.sendCommand({command: 4});
		//Net.add(CNC.Settings.CommandUrl + "?type=single&rnd=" + Math.random(), JSON.stringify({command: 4}), function(){});
	},

	StateReturned : function (event,message) {
		if (!message) return;
		if (typeof message == "string"){
			message = JSON.parse(message);
		}
		lx = message.x;
		ly = message.y;
		lz = message.z;

		message.line = parseInt(message.line);
		this.do("state", message);

		this.LastState = message;
		this.X = message.x;
		this.Y = message.y;
		this.Z = message.z;
		this.stateA = message.stateA;
		this.stateB = message.stateB;

		Channels.emit("device.state", message);

		this.state = parseInt(message.state);
	},

	Command : function (str, callback) {
		WS.Body.add(".busy");
		this.Device.send(str);
		//Net.add(CNC.Settings.CommandUrl + "?type=single&rnd=" + Math.random(), str, CNC.CommandComplete);
	},

	ProgCommand : function (str, callback) {
		WS.Body.add(".busy");
		if (typeof (str) == "string") {
			str = CNC.CommandType[str.toLowerCase()];
			this.Device.send({command: str});/*
		if (str){
			Net.add(CNC.Settings.CommandUrl + "?type=single&rnd=" + Math.random(), JSON.stringify({command: str}), CNC.CommandComplete);
		}*/
		}
	},

	SendProgram : function (cmds) {
		WS.Body.add(".busy");
		
		for (var i = 0; i < cmds.length; i+= 10){
			var tarr = [];
			for (var j = i; j < i+10 && j < cmds.length; j++){
				tarr.push(cmds[j]);
			}
			console.log("Lineds sended " + (i + tarr.length) + " of " + cmds.length);
			this.Device.sendProgram(tarr);				
		}
		
		/*if (typeof (str) == "string") {
		Net.add(CNC.Settings.ProgramUrl + "?type=code&rnd=" + Math.random() + (CNC.DebugMode ? "&debug=true" : ""), str, CNC.CommandComplete);
	}*/
	},

	Go : function (x, y, z) {
		this.Command({ command: 1, x: x, y: y, z: z, speed: this.Settings.speed });
	},


	Move : function (x, y, z) {
		this.Command({ command: 5, x: x, y: y, z: z, speed: this.Settings.speed });
	},


	Rebase : function (x, y, z) {
		this.Command({ command: 2, x: x, y: y, z: z, speed: 0 });
	},

	/*
CNC.SetDebugMode = function () {
	CNC.DebugMode = !CNC.DebugMode;
	if (CNC.DebugMode) {
		CNC.ProgCommand("pause");
	}
};
CNC.GetProgram = function(name){
	return CNC.QPrograms[name];
}

LoadProgram : function(fpath, callback){
	Storage.get("programs/" + fpath + "?" + Math.random(), function(text){
		callback(text, fpath);
	});
}
*/
	QuickCommand : function (txt) {
		txt = CncCompiler.Compile(this.Settings, txt, { x: lx, y : ly, z: lz, speed : this.Settings.speed });
		if (txt && txt.length > 0){
			this.Command(txt[0]);
		}
	},


	LoadSettings : function(callback){
		var cnc = this;
		this.configStorage.get("cnc.json?rnd=" + Math.random(), function(result){
			if (result){
				cnc.Settings = result;
				/*if (!result.length) result = [ result ];
				var settings = {};
				for (var i = 0; i < result.length; i++){
					settings[result[i].id] = result[i].value;
				}*/
				callback(result);
			}
		});	
	},

	SaveSettings :function(settings){
		/*var data = [];
		for (var item in settings){
			data.push({id: item, value : settings[item]});
		}*/
		this.configStorage.POST("cnc.json", JSON.stringify(settings), function(result){

		});	
	},
});
