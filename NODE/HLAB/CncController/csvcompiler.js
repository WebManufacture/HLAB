

CNC.CompileCsv = function (text) {
	var lxx = 0;
	var lyy = 0;
	var lzz = 0;
	if (CNC.LastState) {
		var lzz = parseInt(CNC.LastState.z);
		var lxx = parseInt(CNC.LastState.x);
		var lyy = parseInt(CNC.LastState.y);
	}
	nx = 10;
	ny = 10;
	ps = 0;
	zup = 20000;
	zdwn = 58000;
	rbtx = 0;
	rbty = 0;
	rbtz = 0;
	scx = 1;
	scy = 1;
	scz = 1;
	var lss = parseInt(DOM("#millingSpeed").value);
	if (isNaN(lss)) {
		lss = 16000;
	}
	var code = [];
	text = text.split("\n");
	for (var i = 0; i < text.length; i++) {
		if (text[i].trim().length == 0) break;
		if (text[i].end(";")) {
			text[i] = text[i].substr(0, text[i].length - 1);
		}
		var coords = text[i].split(" ");
		if (coords.length > 0) {
			if (isNaN(parseFloat(coords[0]))) {
				var command = coords[0];
				coords = coords[1].split(",");
				if (command == "PU") {
					if (lzz > zup) {
						code.push({ command: 1, x: lxx, y: lyy, z: zup, speed: CNC.Settings.speed });
						lzz = zup;
					}
				}
				if (command == "PD") {
					if (lzz < zdwn) {
						code.push({ command: 1, x: lxx, y: lyy, z: zdwn, speed: CNC.Settings.speed });
						lzz = zdwn;
					}
				}
				if (command == "SZ") {
					zup = parseParam(coords[0], zup, zup);
					zdwn = parseParam(coords[1], zdwn, zdwn);
					continue;
				}
				if (command == "BASE") {
					rbtx = parseParam(coords[0], rbtx, rbtx);
					rbty = parseParam(coords[1], rbty, rbty);
					rbtz = parseParam(coords[2], rbtz, rbtz);
					continue;
				}
				if (command == "DU") {
					if (coords[0] == 'mm') {
						nx = 400;
						ny = 400;
					}
					if (coords[0] == 'hp') {
						nx = 10;
						ny = 10;
					}
					if (coords[0] == 'steps') {
						nx = 1;
						ny = 1;
					}
					continue;
				}
				if (command == "SCALE") {
					scx = parseParam(coords[0], scx, scx);
					scy = parseParam(coords[1], scy, scy);
					scz = parseParam(coords[2], scz, scz);
					continue;
				}
			}
			else {
				coords = text[i].split(",");
			}
			var line = { command: 1, x: parseParam(coords[ps], lxx, lxx), y: parseParam(coords[ps + 1], lyy, lyy), z: parseParam(coords[ps + 2], lzz, lzz), speed: parseParam(coords[ps + 3], lss, lss) };
			line.x = Math.round(line.x * nx * scx + rbtx);
			line.y = Math.round(line.y * ny * scy + rbty);
			line.z = Math.round(line.z * scz + rbtz);
			lxx = line.x;
			lyy = line.y;
			lzz = line.z;
			lss = line.speed;
			code.push(line);
		}
	}
	code.push({ command: 1, x: lxx, y: lyy, z: zup, speed: CNC.Settings.speed });
	return code;
};