Device = function(url){
	//if (!url) url = "ws://hlab.web-manufacture.net:4008";
	
	if (!url) url = "home.web-manufacture.net";
	this.localUrl = url;
	this.socketUrl = "ws://" + url + ":5000";
	
	Device.Current = this;
	
	var self = this;
	
	this._state = "offline";
	Object.defineProperty(this, "State", {
		get : function(){
			return this._state;
		},
		set : function(value){
			this._state = value;
		}
	});
	
	Device._super.call(this);
}

Inherit(Device, Eventer, {
	send : function(to, data){
		this.socket.send(JSON.stringify({ dst: to, data : data}));
	},
	
	_configReceived : function(result){
		this.fire("config", result);
	},
	
	connect : function(port){
		if (port){
			this.socket = new WebSocket(this.socketUrl + "/" + port);
		}
		else{
			this.socket = new WebSocket(this.socketUrl+ "/");
		}
		this.socket.onopen = CreateClosure(this._onConnect, this);
		this.socket.onclose = CreateClosure(this._onClose, this);
		this.socket.onmessage = CreateClosure(this._onMessage, this);
		this.socket.onerror = CreateClosure(this._onError, this);	
	},

	_onConnect : function(){
		this.State = "connected";
		this.fire("connect");
	},
	
	_onClose : function(){
		this.State = "closed";
		this.fire("close");
	},

	_onMessage : function(event){
		/*var message = JSON.parse(event.data);
		if (message.type == 'config'){
			this.config = message.data;
			//annels.predefine(this.channelName + ".config", this.config);
			//annels.emit(this.channelName + ".config", this.config);
			return;
		}*/
		this.emit("data", event);
		/*if (message.type == 'from-uart-data'){
			Channels.emit(this.channelName + ".received", message.data);
		}
		if (message.type == 'to-uart-data'){
			ContentPanel.div(this.channelName + ".mirrored", message.data);
		}*/
	},

	_onError : function(){
		this.emit("error");
	}
});

