function Robo(robo){
	
	var num = robo.get("@num");
	
	console.log(num);
	
	Object.defineProperty(this, "X", {
		get:function(){
			return robo._x;
		}
	});

	Object.defineProperty(this, "Y", {
		get:function(){
			return robo._y;
		}
	});
		
	Object.defineProperty(this, "Type", {
		get:function(){
			return robo._type;
		}
	});
	
	Object.defineProperty(this, "Num", {
		get:function(){
			return num;
		}
	});
	
	Object.defineProperty(this, "Radar", {
		get:function(){
			return robo._radar;
		}
	});

	Object.defineProperty(this, "Sensor", {
		get:function(){
			return robo._sense;
		}
	});
	
	var messages = this._messages = [];
	var messageNewFlag = false;
	
	robo._receiveMessage = function(message, actor, cicle){
		messageNewFlag = true;
		messages.push({
			message : message,
			from : actor,
			date : new Date(),
			cicle : cicle,
			readed : false
		});
	};
	
	this.GetNewMessage = function(){
		for (var i = 0; i < this._messages.length; i++){
			if (!this._messages[i].readed) {
				this._messages[i].readed = true;
				return this._messages[i];
			}
		}
		messageNewFlag = false;
		return null;
	};
	
	this.CheckMessages = function(){
		return messageNewFlag;
	};
	
	this.GetMessages = function(){
		messageNewFlag = false;
		for (var i = 0; i < this._messages.length; i++){
			this._messages[i].readed = true;
		}
		return this._messages;
	};
	
	this.SendMessage = function(){
		if (robo._sendMessage){
			return robo._sendMessage.apply(this, arguments);
		}
		return null;
	};
	
	robo.StartStep = function(){
		this._moved = false;
	};
	
	robo.FinishStep = function(){
		_created = false;
	};
	
	robo.SetCoord = function(x, y){
		x = parseInt(x); y = parseInt(y);
		if (this._moved || isNaN(x) || isNaN(y)) return;
		var rx = this._x;
		var ry = this._y;
		if (x != rx && x >= 0 && x <= maxX && !((rx > x && this._sense.left) || (rx < x && this._sense.right))){
			rx = x;
			this._moved = true;
		}
		if (y != ry && y >= 0 && y <= maxY && !((ry > y && this._sense.top) || (ry < y && this._sense.bottom))){
			ry = y;
			this._moved = true;
		}
		if (this._moved){
			this._setCoordInternal(rx, ry);
		}
	};
	
	robo._setCoordInternal = function(x,y){
		x = parseInt(x); y = parseInt(y);
		this._x = x;
		this.style.left = (x + this._xShift) + "px";
		this._y = y;
		this.style.top = (y + this._yShift) + "px";
	}
	
	function SetCoord(x, y){
		return robo.SetCoord(x, y);
	}
	
	this.goLeft = function(){
		SetCoord(robo._x - 1, robo._y);
	},
		
	this.goRandom = function(){
		var x = 1 - parseInt(Math.random() * 3);
		var y = 1 - parseInt(Math.random() * 3);
		SetCoord(robo._x - x, robo._y - y);
	},
		
	this.goVector = function(x, y){
		if (!x) x = 0;
		if (!y) y = 0;
		if (x > 0) x = 1;
		if (y > 0) y = 1;
		if (x < 0) x = -1;
		if (y < 0) y = -1;
		SetCoord(robo._x + x, robo._y + y);
	},
		
	this.goRight = function(){
		SetCoord(robo._x + 1, robo._y);
	},
		
	this.goUp = function(){
		SetCoord(robo._x, robo._y - 1);
	},
		
	this.goDown = function(){
		SetCoord(robo._x, robo._y + 1);
	},
		
	this.setText = function(text){
		if (!_created) robo.textContent = text;
	},
	
	this.saveState = function(){
		robo._savedState = { X: robo._x, Y : robo._y };
		return { X: robo._x, Y : robo._y };
	},

	this.restoreState = function(){
		if (robo._savedState){
			SetCoord(robo._savedState.X, robo._savedState.Y);
		}		
		return { X: robo._x, Y : robo._y };
	}
	
	this.isFree = function(){
		return !(robo._sense.left || robo._sense.right || robo._sense.top || robo._sense.bottom);
	}
	
	var _created = true;
	robo._type = 0;
	robo._x = 0;
	robo._xShift = parseInt(robo.offsetLeft);
	robo._y = 0;
	robo._yShift = parseInt(robo.offsetTop);	
	robo._radar = {left : null, right: null, top: null, bottom : null};
	robo._sense = {leftValue : null, rightValue: null, topValue: null, bottomValue : null};
	
	Object.defineProperty(robo._sense, "left", {
		get:function(){
			return this.leftValue !== null;
		}
	});	
	Object.defineProperty(robo._sense, "right", {
		get:function(){
			return this.rightValue !== null;
		}
	});
	Object.defineProperty(robo._sense, "top", {
		get:function(){
			return this.topValue !== null;
		}
	});
	Object.defineProperty(robo._sense, "bottom", {
		get:function(){
			return this.bottomValue !== null;
		}
	});
}

Robo.prototype = {
			
}

