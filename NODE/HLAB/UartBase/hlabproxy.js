HLabProxy = function(url, channelName){
	if (!url) url = "ws://localhost:5000";
	this.socketUrl = url;
	
	var self = this;
	
	this._state = "offline";
	Object.defineProperty(this, "State", {
		get : function(){
			return this._state;
		},
		set : function(value){
			this._state = value;
			Channels.emit(this.channelName + ".state", value);
		}
	});
	
	
	this._initSocket();
	
	if (!channelName) channelName = "uart";
	this.channelName = channelName;
	if (Channels){
		Channels.on(channelName + ".send", function(data){
			self.send(data);
		});
	}
	setInterval(function(){
		Channels.emit(channelName + ".state", self.State);
	}, 400)
}

HLabProxy.prototype = {
	send : function(data){
		this.socket.send(JSON.stringify(data));
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
		Channels.emit(this.channelName + ".error");
		//setTimeout(CreateClosure(this._initSocket, this), 3000);
	}
}

