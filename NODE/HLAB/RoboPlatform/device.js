Device = {	
	THRESHOLD_COMMAND : 10,
	
	PIN_COMMAND : 21,
	BIT_COMMAND : 22,
	WAIT_COMMAND : 31,
	LOOP_COMMAND : 32,
		
	pwmCoeff : 10,
	
	Init : function(uart){
		//this.uart = uart;	
	},
	
	Compile : function(progs){
		return progs.flat;
	},
	
	
	CompilePort : function(prog){
		var commands = [];
		var ls = 1; //lastPortState
		for (var i = 0; i < prog.length; i++){
			var p = prog[i];
			if (typeof(p.value) != "number") commands.push(p);
			else{
				var time = (p.value - ls) * Settings.timeCoef;
				ls = p.sec;
				if (p.value < 100 && p.value > 0){
					commands.push({command : this.BIT_COMMAND, value : 1});
					var wt = (100 - p.value) * this.pwmCoef;
					if (wt < time){
						commands.push({command : this.WAIT_COMMAND, value : wt});
						var ct = Math.floor(time/wt);
						if (ct > 1){
							commands.push({command : this.LOOP_COMMAND, value : (2<<16) + wt});
						}
						if (time%wt){
							commands.push({command : this.WAIT_COMMAND, value : time%wt});
						}
					}
					else{
						commands.push({command : this.WAIT_COMMAND, value : time});
					}
					continue;
				}
				if (time > 0){
					commands.push({command : this.WAIT_COMMAND, value : time});
				}
				if (p.value == 100){
					commands.push({command : this.PIN_COMMAND, value : 1});
					continue;
				}
				if (p.value == 0){
					commands.push({command : this.PIN_COMMAND, value : -1});
					continue;
				}
			}
		}
		
		return commands;
	},
	
	ProgramNew : function(prog){
		if (prog.length == 0) return;
		this.clear();
		var maxTime = prog.flat[prog.flat.length - 1].sec;
		for (var port = 0; port < prog.length; port++){
			var p = prog[port];
			if (!p || p.length == 0) continue;
			var last = p[0].sec;
			if (last > 1){
				this.send(2, port + 1);
				this.send(10, port + 1, (last-1) * Settings.timeCoef);
			}
			for (var i = 1; i < p.length; i++){
				if (p[i-1].value > 0){
					this.send(1, port + 1);
				}	
				else{
					this.send(2, port + 1);
				}
				this.send(10, port + 1, (p[i].sec - last) * Settings.timeCoef);
				last = p[i].sec;
			}
			var last = p[p.length - 1].sec;
			if (last < maxTime){			
				this.send(2, port + 1);
				this.send(10, port + 1, (maxTime - last) * Settings.timeCoef);
			}
		}
		this.flush();
	},

	
	ProgramTime : function(prog){
		/*prog = Device.Compile(prog);
		this.send({command : Device.THRESHOLD_COMMAND, value : 3000});
		for (var i = 0; i < prog.length; i++ ){
			var p = prog[i];
			if (p){
				if (p.value > 0 && p.value < 100){
					this.send({command : 2, address: 0xEE, port: p.port, low : (100 - p.value)/10, high: 1, time : p.sec * PUI.timeCoef});
				}
				if (p.value == 100){
					this.send({command : 1, address: 0xEE, port: p.port, low : 1, high:0, time : p.sec * PUI.timeCoef});
				}
				if (p.value == 0){
					this.send({command : 1, address: 0xEE, port: p.port, low : 0, high:0, time : p.sec * PUI.timeCoef});
				}
			}
		}*/	
		//this.send({command : 7, address: 0xEE, port: 0, low : 0, high:0});
	},
	
	ProgramIntervals : function(prog){
		var cprog = Device.Compile(prog);
		//THRESHOLD
		if (cprog.length == 0) return;
		this.clear();
		var maxTime = cprog[cprog.length - 1].sec;
		for (var port = 0; port < prog.length; port++){
			var p = prog[port];
			if (!p || p.length == 0) continue;
			var last = p[0].sec;
			if (last > 1){
				this.send(1, port + 1, -(last-1) * Settings.timeCoef);
			}
			for (var i = 1; i < p.length; i++){
				if (p[i-1].value > 0){
					this.send(1, port + 1, (p[i].sec - last) * Settings.timeCoef);
				}	
				else{
					this.send(1, port + 1, (last - p[i].sec) * Settings.timeCoef);
				}
				last = p[i].sec;
			}
			var last = p[p.length - 1].sec;
			if (last < maxTime){
				this.send(1, port + 1, -(maxTime - last) * Settings.timeCoef);
			}
		}
		this.flush();
	},

	Start : function(){
		if (this.currentTimeout) clearTimeout(this.currentTimeout);
		var prog = Device.Compile();
		this.currentCommand = 0;
		this.currentProg = prog;
		if (prog.length > 0){
			this.currentTimeout = setTimeout(this.nextStep.bind(this), prog[0].sec * PUI.timeCoef * 100000);
		}
	},
	StartF : function(){
		if (this.currentTimeout) clearTimeout(this.currentTimeout);
		
		var prog = Device.Compile(PUI.GetProgram());
		this.currentCommand = 0;
		this.currentProg = prog;
		if (prog.length > 0){
			PUI.timeCoef = 0.0001;
			this.currentTimeout = setTimeout(this.nextStep.bind(this), prog[0].sec * PUI.timeCoef * 100000);
		}
	},
	
	Reset : function(){
		uart.send(this.toSized({command : 0, port: 1}));
	},
	
	Stop : function(){
		if (this.currentTimeout) clearTimeout(this.currentTimeout);
		uart.send([2, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3]);//this.send({command : 9, port: 1, value : 0});
	},
	
	nextStep :function(){
		var prog = this.currentProg;
		if (this.currentCommand < prog.length){
			var p = prog[this.currentCommand];
			if (p){
				if (p.value > 50){
					uart.send([2, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3]);
					uart.send([2, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3]);
				}
				else{
					uart.send([2, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3]);
					uart.send([2, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3]);
				}
			}
			this.currentCommand++;
			this.lastsec = p.sec * PUI.timeCoef ;
			p = prog[this.currentCommand];
			if (p){
				this.currentTimeout = setTimeout(this.nextStep.bind(this), (p.sec * PUI.timeCoef  - this.lastsec) * 100000);
			}
		}
	},
	
	
	toSized : function(obj){
		//var size = 2;
		if (!obj.address) obj.address = 0xEE;
		var addr1 = (obj.address >> 8)&255;
		var addr2 = obj.address&255;
		var bytes = [addr1, addr2];
		bytes.push(obj.command);
		if (!obj.port || obj.port <= 0){
			bytes.push(0);
		}
		else{
			bytes.push(obj.port-1);	
		}		
		if (obj.value){
			var value = parseInt(obj.value);
			bytes.push((value >> 24)&255);
			bytes.push((value >> 16)&255);
			bytes.push((value >> 8)&255);
			bytes.push((value)&255);
		}
		/*
		bytes.push(obj.low&255);
		bytes.push((obj.high >> 24)&255);
		bytes.push((obj.high >> 16)&255);
		bytes.push((obj.high >> 8)&255);
		bytes.push(obj.high&255);
		bytes.push((obj.time  >> 24)&255);
		bytes.push((obj.time  >> 16)&255);
		bytes.push((obj.time  >> 8)&255);
		bytes.push(obj.time &255);*/
		return bytes;
	},
	
	clear : function(){
		this.commands = [];	
	},
	
	send : function(obj){
		if (!this.commands) this.clear();
		if (typeof (obj) == "object"){
			this.commands.push(obj);
		}
		else{
			if (typeof value == "undefined"){
				this.commands.push({command : obj, port : port});
			}
			else{
				this.commands.push({command : obj, port : port, value : value});
			}
		}
		this.flush(this.commands);
	},
	
	flush : function(commands){
		if (!commands) commands = this.commands;		
		if (!commands || commands.length == 0) return;
		//this.uart.send(this.toSized({command : Device.THRESHOLD_COMMAND, port : 0,  value : 6000}));
		uart.send(this.toSized({command : 40}));
		for (var i = 0; i <  this.commands.length; i++){
			uart.send(this.toSized(this.commands[i]));
		}
		uart.send(this.toSized({command : 41}));
	}
}


