GerberCompiler = function (cnc) {
	this.cnc = cnc;
};

GerberCompiler.Compile = function (cnc, text, callback) {
	var context = new GerberCompiler(cnc);
	return context.compile(text, callback);
}

GerberCompiler.prototype = {
	compile: function (text, callback) {
		var code = [];
		var xRatio = 1;
		var yRatio = 1;
			this.x = lx;
		this.y = ly;
		this.z = lz;
		this.x = parseInt(this.x);
		this.y = parseInt(this.y);
		this.z = parseInt(this.z);
		this.speed = this.cnc.speed;
		this.nx = this.cnc.mmCoefX * xRatio;
		this.ny = this.cnc.mmCoefY * yRatio;
		this.zg = this.cnc.zGValue;
		if (!this.zg) this.zg = 1;
		this.lx = this.x;
		this.ly = this.y;
		this.lz = this.z;
		this.subX = this.lx;
		this.subY = this.ly;
		if (isNaN(this.speed)){
			this.speed = this.defaultSpeed();
		}		
		this.xStart = this.x;
		this.yStart = this.y;
		var startDef = true;
		this.xStart = Math.round(parseFloat(this.xStart) * this.nx);
		if (isNaN(this.xStart)){
			startDef = false;
			this.xStart = this.lx;
		}				
		this.yStart = Math.round(parseFloat(this.yStart) * this.ny);
		if (isNaN(this.yStart)){
			startDef = false;
			this.yStart = this.ly;	
		}
		//Parsing apertures:
		var apertures = {};
		var regex = /%ADD(\d+)([RC]),(\d+\.\d+)(?:X(\d+\.\d+))?/g;
		var aperture = null;
		var currentAperture = null;
		while((aperture = regex.exec(text)) != null) {
			var apName = aperture[1];
			var ap = apertures[apName] = {
				form: aperture[2],
				width: parseFloat(aperture[3]),
				height : parseFloat(aperture[4])
			}
			if (isNaN(ap.height)) ap.height = ap.width;
			ap.width = ap.width * this.nx;
			ap.height = ap.height * this.ny;
			if (!currentAperture){
				currentAperture =ap;
			}
		}
		code.push(this.spindleUp());
		var me = this;
		
		function draw(x, y){
			if (!currentAperture) return;
			var lx = me.x;
			var ly = me.y;
			var sx = currentAperture.width/2;
			var sy = currentAperture.height/2;
			sx = parseInt(sx);
			sy = parseInt(sy);
			if (lx == x){
				if (y > ly){
					code.push(me.Goto(lx - sx, ly-sy));
					code.push(me.spindleDown());
					code.push(me.Goto(x - sx, y + sy));
					code.push(me.Move(sx*2, 0));
					code.push(me.Goto(lx + sx, ly - sy));
					code.push(me.Move(-sx*2, 0));
					code.push(me.spindleUp());
				}
				else{
					code.push(me.Goto(lx-sx, ly+sy));
					code.push(me.spindleDown());
					code.push(me.Goto(x - sx, y - sy));
					code.push(me.Move(sx*2, 0));
					code.push(me.Goto(lx + sx, ly + sy));
					code.push(me.Move(-sx*2, 0));
					code.push(me.spindleUp());
				}
				code.push(me.Goto(x, y));
				return;
			}
			if (ly == y){
				if (x > lx){
					code.push(me.Goto(lx-sx, ly-sy));
					code.push(me.spindleDown());
					code.push(me.Goto(x+sx, y - sy));
					code.push(me.Move(0, sy*2));
					code.push(me.Goto(lx-sx, ly + sy));
					code.push(me.Move(0, -sy*2));
					code.push(me.spindleUp());
				}
				else{
					code.push(me.Goto(lx+sx, ly-sy));
					code.push(me.spindleDown());
					code.push(me.Goto(x - sx, y - sy));
					code.push(me.Move(0, sy*2));
					code.push(me.Goto(lx + sx, ly + sy));
					code.push(me.Move(0, -sy*2));
					code.push(me.spindleUp());
				}				
				code.push(me.Goto(x, y));
				return;
			}
			var sector = 0;
			var xa, ya = 0;
			if (x > lx){
				sector += 2;
				xa = x - lx;
			}
			else{
				xa = lx - x;
			}
			if (y > ly){
				sector += 1;
				ya = y - ly;
			}
			else{				
				ya = ly - y;
			}
			switch (sector){
				case 0:
				
			}
			//code.push(me.Move(sx, sy));
			var d = Math.sqrt(xa*xa + ya * ya);
			
			me.GetCircleProg(code, lx, ly, sx, sy);
			if (x == lx && y == ly){
				code.push(me.spindleUp());
				return;
			}
			code.push(me.spindleDown());
			code.push(me.Goto(x,y));
			me.GetCircleProg(code, x, y, sx, sy);
			code.push(me.spindleUp());
			//code.push(me.Move(-sx*2, 0));
			//code.push(me.Goto(lx,ly));
			//code.push(me.Move(sx*2, 0));
		}
		
		var regex = /^((?:[GXYD]\d+)+)\*$/gm;
		var commands = text.match(regex);
		for (var i = 0; i < commands.length; i++) {
			var parser = /([GXYD])(\d+)/g;
			var parts = parser.exec(commands[i]);
			if (parts){
				var x = this.x;
				var y = this.y;
				if (parts[1] == "D"){
					currentAperture = apertures[parts[2]];
				}
				if (parts[1] == "X"){
					x = parseInt(parseFloat(parts[2])*this.nx/1000);
				}
				if (parts[1] == "Y"){
					y = parseInt(parseFloat(parts[2])*this.ny/1000);
				}
				parts = parser.exec(commands[i]);
				if (parts && parts[1] == "Y"){
					y = parseInt(parseFloat(parts[2])*this.ny/1000);
					parts = parser.exec(commands[i]);
				}
				if (x == 0 && y == 0) continue;
				if (parts && parts[0] == "D1"){
					draw(x,y)
				}
				if (parts && parts[0] == "D2"){
					if (this.isSpindleDown()){
						code.push(this.spindleUp());
					}
					code.push(this.Goto(x, y));
				}
				if (parts && parts[0] == "D3"){
					if (this.isSpindleDown()){
						code.push(this.spindleUp());
					}
					code.push(this.Goto(x, y));
					draw(x,y);
				}												
			}
		}
		return code;
	},
	
	followStart : function(){
		return this.Goto(this.xStart, this.yStart);
	},
	
	spindleUp : function(){
		if (this.z > this.lz){
			return this.Move(0, 0, (this.lz - this.z) - this.zg);
		}
		return null;
	},
	
	isSpindleDown : function(){
		return this.z > this.lz;
	},
	
	spindleDown : function(){
		if (this.lz >= this.z){
			return this.Move(0, 0, (this.lz - this.z) + this.zg);
		}
		return null;
	},
	
	Goto : function(x, y, z){
		if (z == undefined){
			z = this.z;	
		}
		var line = { command: CNC.GCommands.G, x: x, y: y, z: z, speed: this.defaultSpeed() };
		this.x = line.x;
		this.y = line.y;
		this.z = line.z;
		this.speed = line.speed;
		return line;
	},
	
	
	Move : function(x, y, z){
		if (z == undefined){
			z = 0;	
		}
		var line = { command: CNC.GCommands.M, x: x, y: y, z: z, speed: this.defaultSpeed() };
		this.x += line.x;
		this.y += line.y;
		this.z += line.z;
		this.speed = line.speed;
		return line;
	},
	
	defaultSpeed: function (ord) {
		var c =	this.speed;
		if (!c && ord){
			c = this.cnc[ord.toLowerCase() + "Speed"];
		}
		if (!c){
			c = this.cnc.speed;
		}
		return c;
	},
	
	GetCircleProg: function (code, x, y, r1, r2) {
        var radius = r1;
        var sangle = 0;
        var fangle = 2 * Math.PI;
        var steps = 16;
        
        if (!r1) r1 = radius;
        if (!r2) r2 = radius;
        var res = code;
        sangle = 0;
        var lr = { x: this.x, y: this.y, z: this.z };
        var step = 2*Math.PI / steps;
		var lx = this.x;
		var ly = this.y;
		res.push(this.spindleDown());
		for (var angle = sangle; (angle <= fangle && fangle > sangle) || (angle >= fangle && fangle < sangle); angle += step) {
            var xc = Math.round(r1 * Math.cos(angle));
            var yc = Math.round(r2 * Math.sin(angle));
			var line = { command: CNC.GCommands.G, x: xc + lx, y: yc + ly, z: this.z, speed: this.defaultSpeed() };
			this.x += xc;
			this.y += yc;
            res.push(line);
        }
		if (angle != fangle){
			angle = fangle;	
			var xc = Math.round(r1 * Math.cos(angle));
            var yc = Math.round(r2 * Math.sin(angle));
			var line = { command: CNC.GCommands.G, x: xc + lx, y: yc + ly, z: this.z, speed: this.defaultSpeed() };
			this.x += xc;
			this.y += yc;
            res.push(line);
		}
		res.push(this.spindleUp());
		var line = { command: CNC.GCommands.G, x: x, y: y, z: this.z, speed: this.defaultSpeed() };
		this.x = x;
		this.y = y;
        res.push(line);
        return res;
    }
}

RegisterCompiler('gbr', GerberCompiler);