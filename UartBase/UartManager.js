UartProtocols =  {
	Raw : 0,
	Simple : 1,      //UNSIZED               #02 ... data ... #03
	SimpleCoded : 2, //UNSIZED               coded by 2bytes ($3D : #F3 #FD) data      #02 ... coded data ... #03
	SimpleCRC : 3,   //UNSIZED               WITH CRC  #02 ... data ... #crc #03
	PacketInvariant : 5,// CAN BE 2, 3, 10, 11, 14, 15
	Sized : 10,      //SIZED  #01 #size #02? ... data ... #03
	SizedOld : 11,   //SIZED  #01 #size #02? ... data ... #04
	SizedCRC : 14,   //SIZED  #01 #size #02? ... data ... #CRC #03
	SizedCRC_old : 15,   //SIZED  #01 #size ... data ... #CRC #04
	Addressed : 20,  //With addr  #01 #size #addr ... data ... #03
	AddressedOld : 21,  //With addr  #01 #size #addr ... data ... #04
	XRouting : 30,    //XRouting addressed  #01 #size #dstAddr #dstType #srcAddr #srcType ... data ... #crc #03
	LIN : 32    //XRouting addressed  #01 #size #02 #dstAddr #dstType #srcAddr #srcType ... data ... #crc #03
}


UartManager = function(url){
	this._super();
	if (!url) url = "http://localhost:5001";
	this.httpUrl = url;
	url = new Url(url);
	this.urlBase = url.hostname;
	this.browse();
}

Inherit(UartManager, Eventer, {
	browse : function(data){
		var self = this;
		Net.GET(self.httpUrl, function(cfg){
			if (this.status != 200){
				self.emit("error", this.status + " " + this.responseText);
				return;
			};
			console.log(cfg);
			self.configs = cfg;

			var res = { };
			var sr = cfg.Serials;
			for (var i = 0; i < sr.length; i++){
				if (sr[i]) res[sr[i]] = null;
			}
			for (var i = 0; i < cfg.Configs.length; i++){
				var line = cfg.Configs[i];
				if (!res[line.PortName]) res[line.PortName] = line;
				console.log(line.PortName + " " + line.Speed + " " + line.RxPacketType);
			}			 
			if (self.configs && self.configs.SocketPort){
				self.socketUrl = "ws://" + self.urlBase + ":" + self.configs.SocketPort;
			}
			self.AvailableConfigs = res;
			self.do('browse', res);
		});	
	},

	open : function(pname, callback, failBack){
		var self = this;
		if (this.socketUrl){
			self.emit("open", pname);
			var url = self.socketUrl + "/" + pname;
			var client = new UartClient(url, pname);
			if (callback){
				client.once("config", function(cfg){
					callback.call(client, cfg)
				});
			}
			if (failBack){
				client.once("error", function(cfg){
					failBack.call(client, cfg)
				});
			}
			client.once("closed", function(){
				self.emit("close", client)
			});
			return client;
		}
		return null;
	},
	
});

function UartClient(url, port){
	if (!url) url = "ws://localhost:5000";
	this.socketUrl = url;
	this._super();
	this.PortName = port;
	var self = this;

	this._state = "offline";
	Object.defineProperty(this, "State", {
		get : function(){
			return this._state;
		},
		set : function(value){
			this._state = value;
			this.emit(value);
		}
	});
	this._initSocket();
}

Inherit(UartClient, Eventer, {
	send : function(data){
		this.socket.send(JSON.stringify(data));
	},
	
	
	close : function(){
		if (this.socket){
			this.socket.close();
			this.socket = null;
		}
	},

	_initSocket : function(){
		this.socket = new WebSocket(this.socketUrl);
		this.socket.onopen = CreateClosure(this._onConnect, this);
		this.socket.onclose = CreateClosure(this._onClose, this);
		this.socket.onmessage = CreateClosure(this._onMessage, this);
		this.socket.onerror = CreateClosure(this._onError, this);	
	},

	_onConnect : function(){
		this.State = "connected";
	},

	_onClose : function(){
		this.State = "closed";
	},

	_onMessage : function(event){
		var message = JSON.parse(event.data);
		if (message.Direction && message.Data){
			if (message.Direction == 2){
				this.emit("received", message.Data);
			}
			if (message.Direction == 1){
				this.emit("mirrored", message.Data);
			}
			if (message.Direction == 0){
				this.emit("error", message.error);
			}
		}
		if (message.PortName){
			for (var item in message){
				this[item] = message[item];
			}
			this.emit("config", message);
			return;
		}
		if (message.error){
			this.emit("error", message.error);
			return;
		}		
	},

	_onError : function(err){
		this.emit("error", err);
	}
});



