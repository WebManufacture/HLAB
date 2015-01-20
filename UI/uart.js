BIT_0 = 1;
BIT_1 = 2;
BIT_2 = 4;
BIT_3 = 8;
BIT_4 = 16;
BIT_5 = 32;
BIT_6 = 64;
BIT_7 = 128;


Uart = function(url){
	this.url = url;
	if (!this.url.ends("/")){
		this.url += "/";	
	}
	setInterval(this.checkMessages.bind(this), 1000); 
},
		
Inherit(Uart, Channel, {	
	checkMessages : function(){
		var obj = Net.GET(this.url, function(data){
			self.emit("onconnect", data);
			self.OnReceive(data);			
		}); 
	},
	
	OnReceive : function(data){
		this.emit("ondata", data);
		if (typeof (data) == "object"){
			for (var i = 0; i < data.length; data++){
				this.emit("onmessage", data[i]);
			}
		}
	},
	
	Send : function(data){
		Net.POST(this.url, data, function(){});
	}			
});


function parseByte(value, index){
	if (index){
		value >> (8 * (index - 1));
	}
	return (value << 24) >> 24;
}

function parseWord(value, index){
	return (value << 16) >> 16;
}
