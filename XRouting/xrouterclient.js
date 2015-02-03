XRouter = function(url){
	//if (!url) url = "ws://hlab.web-manufacture.net:4008";
	
	if (!url) url = "localhost";
	this.localUrl = url;
	this.httpUrl = "http://" + url + ":5001";
	this.socketUrl = "ws://" + url + ":5000";
	
	XRouter.Current = this;
	
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
	
	XRouter._super.call(this);
}

Inherit(XRouter, Eventer, {
	send : function(data){
		this.socket.send(JSON.stringify(data));
	},
	
	getConfig : function(callback){
		if (callback){
			Net.GET(this.httpUrl, CreateClosure(callback, this));
		}
		else{
			Net.GET(this.httpUrl, CreateClosure(this._configReceived, this));
		}
	},
	
	_configReceived : function(result){
		this.fire("config", result);
	},
	
	connect : function(port){
		this.socket = new WebSocket(this.socketUrl + "/" + port);
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
		var message = JSON.parse(event.data);
		if (message.type == 'config'){
			this.config = message.data;
			Channels.predefine(this.channelName + ".config", this.config);
			Channels.emit(this.channelName + ".config", this.config);
			return;
		}
		if (message.type == 'from-uart-data'){
			Channels.emit(this.channelName + ".received", message.data);
		}
		if (message.type == 'to-uart-data'){
			ContentPanel.div(this.channelName + ".mirrored", message.data);
		}
	},

	_onError : function(){
		this.emit("error");
	}
});

