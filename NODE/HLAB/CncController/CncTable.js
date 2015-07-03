WebSocketProvider = function(settings, callback){
	var messagesUrl = this.url = settings.MessagesUrl;
	if (callback){
		this.once("connect", callback);
	}
	this.connect();
	this._super();
}

Inherit(WebSocketProvider, EventEmitter, {
	_onConnect: function(message){
		this.do("connect", message);
	},
	
	_onMessage: function(message){
		if (message && message.data){
			message = message.data;
			if (typeof message == "string"){
				message = JSON.parse(message);
			}
			this.do("state", message);
		}
	},
	
	_onError: function(message){
		console.error(message);
		this.do("error", message);
	},
	
	_onClose: function(message){
		this.do("close", message);
		setTimeout(CreateClosure(this.connect, this), 1000);
	},
	
	connect : function(){
		try{
			this.socket = new WebSocket(this.url);
			this.socket.onopen = CreateClosure(this._onConnect, this);
			this.socket.onclose = CreateClosure(this._onClose, this);
			this.socket.onmessage = CreateClosure(this._onMessage, this);
			this.socket.onerror = CreateClosure(this._onError, this);
		}
		catch(error){
			setTimeout(CreateClosure(this.connect, this), 3000);
		}
	},
	
	send : function(message){
		if (typeof message != "string"){
			message = JSON.stringify(message);
		}
		this.socket.send(message);	
	},
	
	sendCommand : function(message){
		this.send(message);	
	},
		
	sendProgram : function(message){
		if (typeof message != "string"){
			message = JSON.stringify(message);
		}
		this.send(message);	
	}
});