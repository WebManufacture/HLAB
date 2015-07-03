PostCompiler = {};

PostCompiler.ShowCoord = function (line, cname, obj) {
	var div = DOM.div(".code-elem." + cname + "-coord");
	var c = line[cname];
	if (!Number.isFinite(c)) {
		c = obj[cname];
		line[cname] = c;
		div.add(".from-history");
		div.set(null, "(" + c + ")");
	}
	else {
		if (line.command == CNC.GCommands.M){
			//c = c + " (" + (obj[cname] + c) + ")";	
		}
		div.set(null, c);
	}
	return div;
};

PostCompiler.ProcessCode = function(code){
	var lxx = 0;
	var lyy = 0;
	var lzz = 0;
	if (cnc.LastState) {
		var lxx = parseInt(lx);
		var lyy = parseInt(ly);
		var lzz = parseInt(lz);
	}
	var lss = cnc.Settings.speed;
	var maxX = cnc.Settings.maxX;
	var maxY = cnc.Settings.maxY;
	var maxZ = cnc.Settings.maxZ;
	var minX = cnc.Settings.minX;
	var minY = cnc.Settings.minY;
	var minZ = cnc.Settings.minZ;
	var ptx = 0;
	var pty = 0;
	var ptz = 0;
	var validateBorders = false;
	if (Number.isFinite(maxX) && 
		Number.isFinite(maxY) &&
		Number.isFinite(maxZ) && 
		Number.isFinite(minX) &&
		Number.isFinite(minY) &&
		Number.isFinite(minZ)
	   )
	{
		validateBorders = true;
	}	
	for (var i = 0; i < code.length; i++) {
		var line = code[i];
		if (!line) {
			continue;
		}
		if (line.command == 0){
			code.splice(i, 1);
			continue;
		}
		var oc = { x: lxx, y: lyy, z: lzz };
		var ac = {x : line.x, y: line.y, z: line.z};
		if (line.command == CNC.GCommands.M){
			ac.x += lxx;
			ac.y += lyy;
			ac.z += lzz;
		}
		if (validateBorders){
			if ((ac.x < minX || ac.y < minY || ac.z < minZ)) {
				return null;
			}
			if ((ac.x > maxX || ac.y > maxY || ac.z > maxZ)) {
				return null;
			}
		}
		ptz += Math.abs(ac.z - lzz);
		ptx += Math.abs(ac.x - lxx);
		pty += Math.abs(ac.y - lyy);
		if (line.command == CNC.GCommands.M){
			lxx += line.x;
			lyy += line.y;
			lzz += line.z;
		}
		else{
			lxx = line.x;
			lyy = line.y;
			lzz = line.z;
		}
		if (lxx > maxX) maxX = lxx;
		if (lyy > maxY) maxY = lyy;
		if (lxx < minX) minX = lxx;
		if (lyy < minY) minY = lyy;
		lss = line.speed ? line.speed : lss;
	}
	var stats = {};
	stats.minX = minX;
	stats.minY = minY;
	stats.minZ = minZ;
	stats.maxX = maxX;
	stats.maxY = maxY;
	stats.maxZ = maxZ;
	stats.sizeX = (maxX - minX);
	stats.sizeY = (maxY - minY);
	stats.sizeZ = (maxZ - minZ);
	stats.lengthX = (maxX - minX)/cnc.Settings.mmCoefX;
	stats.lengthY = (maxY - minY)/cnc.Settings.mmCoefY;
	stats.lengthZ = (maxZ - minZ)/cnc.Settings.mmCoefZ;
	stats.stepsX = ptx;
	stats.stepsY = pty;
	stats.stepsZ = ptz;
	cnc.currentStats = stats;
	return code;
};


PostCompiler.ShowCode = function(code){
	cnc.ProgramCode = code;
	var lxx = 0;
	var lyy = 0;
	var lzz = 0;
	if (cnc.LastState) {
		var lxx = parseInt(lx);
		var lyy = parseInt(ly);
		var lzz = parseInt(lz);
	}
	var lss = cnc.Settings.speed;
	var zx = 120;
	var zy = 120;//
	var pr = DOM("#ProgramResultCode");
	var dl = DOM("#CodeStats");
	dl.clear();
	pr.clear();
	pr.del(".error");
	var maxX = 0;
	var maxY = 0;
	var maxZ = 0;
	var minX = 1000000000;
	var minY = 1000000000;
	var minZ = 1000000000;
	var ptc = 0;
	var ptx = 0;
	var pty = 0;
	var ptz = 0;
	var ptzScale = 1;
	var validateBorders = false;
	if (Number.isFinite(cnc.Settings.minX) && 
		Number.isFinite(cnc.Settings.minY) &&
		Number.isFinite(cnc.Settings.minZ) && 
		Number.isFinite(cnc.Settings.maxX) &&
		Number.isFinite(cnc.Settings.maxY) &&
		Number.isFinite(cnc.Settings.maxZ)
	   )
	{
		validateBorders = true;
	}
	try {		
		for (var i = 0; i < cnc.ProgramCode.length; i++) {
			var line = cnc.ProgramCode[i];
			if (!line) {
				continue;
			}
			if (line.command == 0){
				cnc.ProgramCode.splice(i, 1);
				i--;
				continue;
			}
			var oc = { x: lxx, y: lyy, z: lzz };
			var ac = {x : line.x, y: line.y, z: line.z};
			if (line.command == CNC.GCommands.M){
				ac.x += lxx;
				ac.y += lyy;
				ac.z += lzz;
			}
			if (validateBorders){
				if ((ac.x < cnc.Settings.minX || ac.y < cnc.Settings.minY || ac.z < cnc.Settings.minZ)) {
					pl.add(".error");
					pr.add(".error");
					cnc.ProgramCode = null;
					break;
				}
				if ((ac.x > cnc.Settings.maxX || ac.y > cnc.Settings.maxY || ac.z > cnc.Settings.maxZ)) {
					pl.add(".error");
					pr.add(".error");
					cnc.ProgramCode = null;
					break;
				}
			}
			var pl = pr.div(".prog-line");
			pl.onclick = function(){
				cnc.ProgramCode.splice(this.lineNum, 1);
				PostCompiler.ShowCode(cnc.ProgramCode);
				Preview.ShowCode(cnc.ProgramCode);
			}
			var lnElem = pl.div(".line-num", i + 1);
			lnElem.add("@num", i + 1);
			pl.set("@line", i + 1);
			pl.lineNum = i;			
			pl.line = line;
			pl.div(".code-elem.command." + CNC.Commands[line.command], CNC.CommandsShort[line.command]);
			pl.add(PostCompiler.ShowCoord(line, "x", oc));
			pl.add(PostCompiler.ShowCoord(line, "y", oc));
			pl.add(PostCompiler.ShowCoord(line, "z", oc));
			pl.div(".code-elem.speed", line.speed ? line.speed : "(" + lss + ")");
			ptc++;			
			ptz += Math.abs(ac.z - lzz);
			ptx += Math.abs(ac.x - lxx);
			pty += Math.abs(ac.y - lyy);
			if (line.command == CNC.GCommands.M){
				lxx += line.x;
				lyy += line.y;
				lzz += line.z;
			}
			else{
				lxx = line.x;
				lyy = line.y;
				lzz = line.z;
			}
			if (lxx > maxX) maxX = lxx;
			if (lyy > maxY) maxY = lyy;
			if (lzz > maxZ) maxZ = lzz;
			if (lxx < minX) minX = lxx;
			if (lyy < minY) minY = lyy;
			if (lzz < minZ) minZ = lzz;
			lss = line.speed ? line.speed : lss;
		}
	}
	catch (e) {
		pr.add(".error");
		throw e;
	}
	var stats = {};
	stats.minX = minX;
	stats.minY = minY;
	stats.minZ = minZ;
	stats.maxX = maxX;
	stats.maxY = maxY;
	stats.maxZ = maxZ;
	var stps = dl.div(".lines","Комманд: " + ptc);
	var min = dl.div(".min", "Min: ");
	min.div(".min-x.elem", "X: " + minX);
	min.div(".min-y.elem", "Y: " + minY);
	min.div(".min-z.elem", "Z: " + minZ);
	var max = dl.div(".max", "Max: ");
	max.div(".max-x.elem", "X: " + maxX);
	max.div(".max-y.elem", "Y: " + maxY);
	max.div(".max-z.elem", "Z: " + maxZ);
	var size = dl.div(".size", "Size: ");
	stats.sizeX = (maxX - minX);
	stats.sizeY = (maxY - minY);
	stats.sizeZ = (maxZ - minZ);
	size.div(".size-x.elem", "X: " + (maxX - minX));
	size.div(".size-y.elem", "Y: " + (maxY - minY));
	size.div(".size-z.elem", "Z: " + (maxZ - minZ));
	stats.lengthX = (maxX - minX)/cnc.Settings.mmCoefX;
	stats.lengthY = (maxY - minY)/cnc.Settings.mmCoefY;
	stats.lengthZ = (maxZ - minZ)/cnc.Settings.mmCoefZ;
	dl.div(".length-x", "Ширина(X,мм): " + ((maxX - minX)/cnc.Settings.mmCoefX));
	dl.div(".length-y", "Высота(Y,мм): " + ((maxY - minY)/cnc.Settings.mmCoefY));
	dl.div(".length-z", "Глубина(Z,мм): " + ((maxZ - minZ)/cnc.Settings.mmCoefZ));
	var stps = dl.div(".steps","Шагов: ");
	stps.div(".steps-x.elem", "X: " + ptx);
	stps.div(".steps-y.elem", "Y: " + pty);
	stps.div(".steps-z.elem", "Z: " + ptz);
	stats.stepsX = ptx;
	stats.stepsY = pty;
	stats.stepsZ = ptz;
	dl.div(".steps-all","Всего: " + (ptx + pty + ptz) + "<br/>");
	pt = Math.round((ptx + pty + ptz) * ptzScale * (0.815390715061537538898254826049));
	dl.div(".times-all", "Итого: " + (new Date(pt)).formatTime(true) + "<br/>");
	cnc.currentStats = stats;
	return stats;
};