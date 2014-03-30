function Robo(robo){
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

	Object.defineProperty(this, "Sensor", {
		get:function(){
			return robo._sense;
		}
	});
	
	robo.StartStep = function(){
		this._moved = false;
	};
	
	robo.FinishStep = function(){

	};
	
	robo.SetCoord = function(x, y){
		x = parseInt(x); y = parseInt(y);
		if (this._moved || isNaN(x) || isNaN(y)) return;
		var rx = this._x;
		var ry = this._y;
		if (x != rx && x >= 0 && x <= maxX && !((rx > x && this._sense.left) || (rx < x && this._sense.right))){
			this._x = x;
			this.style.left = (x + this._xShift) + "px";
			this._moved = true;
		}
		if (y != ry && y >= 0 && y <= maxY && !((ry > y && this._sense.top) || (ry < y && this._sense.bottom))){
			this._y = y;
			this.style.top = (y + this._yShift) + "px";
			this._moved = true;
		}
	};
	
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
		robo.textContent = text;
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
	
	robo._x = 0;
	robo._xShift = robo.offsetLeft;
	robo._y = 0;
	robo._yShift = robo.offsetTop;		
	robo._sense = {left : false, right: false, top: false, bottom : false};
}

Robo.prototype = {
			
}

