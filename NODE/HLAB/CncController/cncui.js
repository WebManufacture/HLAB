CncUI = {};

CncUI.InitCncUI = function(){
	
	
	Storage = Net.GetTunnel("storage/");
	ProgStorage = Net.GetTunnel("storage/programs/");
	CncStorage = Net.GetTunnel("storage/cnc/");
	
	CncUI.LoadSettings(function(result){
		if (result){
			if (result.compileSettings){
				CNC.CompileSettings = result.compileSettings;
			}			
			var cnc = result.defaultCnc;
			if (Request.Params.cnc){
				cnc = result.defaultCnc;
			}
			CncUI.SelectCNC(cnc);
			if (result.cncList){
				
			}
		}
	});	
	
	CncUI.BrowseFiles();
	
	//DOM("#programText").onchange = CncUI.SaveProgram;
	
	DOM.all(".tabs-container .tab-btn").each(function(elem){
		elem.onclick = function(){
			DOM.all(".tab-btn").del(".active");
			DOM.all(".tab").del(".active-tab");
			DOM.all(".tab").hide();
			var tab = DOM(this.attr("for"));
			tab.show();
			tab.add(".active-tab");
			this.add(".active");
			return false;
		};
	});
	
	WS.Body.AttrProperty("state");
	
	StatusBar.InnerProperty("X", "#xCoord");
	StatusBar.InnerProperty("Y", "#yCoord");
	StatusBar.InnerProperty("Z", "#zCoord");
	StatusBar.InnerProperty("stateA", "#stateA");
	StatusBar.InnerProperty("stateB", "#stateB");
	StatusBar.AttrInnerProperty("Prog", "#progCommand");
	StatusBar.AttrInnerProperty("Line", "#progLine");

	StatusBar.X = 0;
	StatusBar.Y = 0;
	StatusBar.Z = 0;
	
	logDiv = DOM("#LogBar");


	nx = 10;
	ny = 10;
	ps = 0;
	scx = 1;
	scy = 1;
	scz = 1;
	ms = 1000;
}

CncUI.LoadSettings = function(callback){
	Storage.get("ui_settings.json?rnd=" + Math.random(), function(result){
		if (result){			
			CncUI.Settings = result;
			callback(result);
		}
	});
}

CncUI.SaveSettings = function(callback){
	Storage.POST("ui_settings.json", JSON.stringify(CncUI.Settings), function(result){	});
}

CncUI.ShowCncSettings = function(){
	CncSettingsWindow.Show();	
}

CncUI.SelectCNC = function(cncName){
	CncUI.cncName = cncName;
	cnc = new CncController(cncName);
	ConfigStorage = cnc.configStorage;
	cnc.LoadSettings(function(settings){
		cnc.Init(settings);
		var ws = cnc.Device;
		if (!settings.mmCoef) settings.mmCoef = 400;
		if (!settings.mmCoefX){
			settings.mmCoefX = settings.mmCoef;
		}
		if (!settings.mmCoefY){
			settings.mmCoefY = settings.mmCoef;
		}
		if (!settings.mmCoefZ){
			settings.mmCoefZ = settings.mmCoef;
		}
		if (!settings.zGValue){
			settings.zGValue = 80;
		}
		cnc.on("command-complete", function(){
			WS.Body.del(".busy");
		});
		ws.on("state", function(ev, message){
			StatusBar.X = message.x;
			StatusBar.Y = message.y;
			StatusBar.Z = message.z;
			StatusBar.stateA = message.stateA;
			StatusBar.stateB = message.stateB;
			if (message.xLimit != message.x){
				var sign = message.x < message.xLimit ? " > " : " < ";
				StatusBar.X = message.x + sign + message.xLimit;
			}
			if (message.yLimit != message.y){
				var sign = message.y < message.yLimit ? " > " : " < ";
				StatusBar.Y = message.y + sign + message.yLimit;
			}
			if (message.zLimit != message.z){
				var sign = message.z < message.zLimit ? " > " : " < ";
				StatusBar.Z = message.z + sign + message.zLimit;
			}
			if (!isNaN(message.line)) {
				WS.Body.set("@state", "");			
				var state = parseInt(message.state);
				if (state == 1){
					if (!window.commandRunning) {
						CNC.ProgramRunned = !isNaN(message.line);
						window.commandRunning = true;
					}
					var current = DOM(".prog-line[line='" + (message.line) + "']");
					if (current && !current.is(".finished")) {
						current.add(".current");
					}
				}
				if (state == 2){	
					window.commandRunning = false;
					DOM.all(".prog-line.current").del(".current");
					DOM.all(".prog-line.prepared").del(".prepared");
					var finished = DOM(".prog-line[line='" + (message.line) + "']");
					if (finished && !finished.is(".finished")) {
						finished.add(".finished");
						var dte = new Date();
						finished.div(".time-complete", "" + dte.formatTime(true));
						if (window.programStartTime) {
							finished.div(".time-total", " - " + (dte.valueOf() - window.programStartTime.valueOf()));
						}
					}
				}
				if (state == 3){	
					window.commandRunning = false;
					DOM.all(".prog-line.current").del(".current");
					DOM.all(".prog-line.prepared").del(".prepared");
					var finished = DOM(".prog-line[line='" + (message.line) + "']");
					var next = DOM(".prog-line[line='" + (message.line + 1) + "']");
					if (finished && !finished.is(".finished")) {
						finished.add(".finished");
						var dte = new Date();
						finished.div(".time-complete", "" + dte.formatTime(true));
						if (window.programStartTime) {
							finished.div(".time-total", " - " + (dte.valueOf() - window.programStartTime.valueOf()));
						}
					}
					if (next) {
						next.add(".prepared");
					}				
				}
				if (state == 4){	
					window.commandRunning = false;
					DOM.all(".prog-line.current").del(".current");
					DOM.all(".prog-line.prepared").del(".prepared");
					var finished = DOM(".prog-line[line='" + (message.line) + "']");
					if (finished && !finished.is(".finished")) {
						finished.add(".finished.error");
						var dte = new Date();
						finished.div(".time-complete", "" + dte.formatTime(true));
						if (window.programStartTime) {
							finished.div(".time-total", " - " + (dte.valueOf() - window.programStartTime.valueOf()));
						}
					}	
					WS.Body.set("@state", "Error");
				}
		}
			
		});
		ws.on("mirror", function(ev, message){
			//CNC.LastCommand = message;
			//CNC.ProgramRunned = !isNaN(parseInt(message.line));
			StatusBar.Prog = CNC.Commands[message.command];
			StatusBar.Line = message.line;
		});
		ws.on("program",function(ev, message){
			/*CNC.ProgramRunned = message.state == "Running";
			if (CNC.ProgramRunned) {
				window.programStartTime = new Date();
				DOM("#CodeStats").div(".start-time", "Start: " + window.programStartTime.formatTime(true));
			}
			if (message.state == "Completed" || message.state == "Aborted") {
				if (window.programStartTime) {
					var f = new Date();
					DOM("#CodeStats").div(".finish-time", "Finish: " + f.formatTime(true));
					DOM("#CodeStats").div(".total-time", "Total: " + (f.valueOf() - window.programStartTime.valueOf()));
					window.programStartTime = null;
				}
			}
			CNC.ProgramState = message.state;
			WS.Body.set("@state", message.state);
			CNC.log("Program", message);*/
		});
		//CncSettingsGrid.set("@url", "storage/" + result.defaultCnc + ".json");
		//CncSettingsGrid.del(".initialized");
		//SGrid.InitGrid(CncSettingsGrid);
		//CncSettingsGrid.ShowObjects(settings);
	});
}

logger = function(type){
	//L.Info( "CNC")
	var li = DOM("#ProgramLog").div(".log");
	DOM("#ProgramLog").ins(li);
	li.div(".item.log-time", (new Date()).formatTime(true));
	for (var i = 0; i < arguments.length; i++){
		var text = arguments[i];
		if (typeof(text) == "object"){
			text = JSON.stringify(text);
		}
		li.div(".item", text + "");
	}
}	

logger.Clear = function(){
	DOM("#ProgramLog").clear();	
}


CncUI.LoadProgram = function(fname, callback){
	ProgStorage.get(fname + "?rnd=" + Math.random(), function(result){
		callback(result);
	}, null, true);//PREVENT PARSING!
};

CncUI.BrowseFiles = function(){
	FilesContainer.clear();
	Storage.All("programs", function(files){
		for (var i =0; i< files.length; i++){
			FilesContainer.add(CncUI.InitFileElement(files[i]));
		}
	});
};

CncUI.InitFileElement = function(fileObj){
	var file = DOM.div(".file", fileObj.name);
	file.fname = fileObj.name;
	file.onclick = function(){
		CncUI.ShowProgram(this.fname);
	}
	var ext = file.fname.split('.');
	if (ext[1]){
		file.ftype = ext[1];	
	}
	else{
		file.ftype = "unknown";
	}
	file.add("." + file.ftype);
	if (ext[1] && ext[1] == 'qcnc'){
		var name = ext[0];
		CncUI.LoadProgram(fileObj.name, function(text){
			CNC.QPrograms[name] = text;
		});
	}
	return file;
};

CncUI.ShowFile = function (fname) {
	var win = DOM(".window.program-editor.prototype").clone();
	win.set("@title", fname);
	DOM.add(win);
	ProgramEditor.Init(win);
	Win.CreateWindow(win);
	var ext = fname.split('.');
	if (ext[1]){
		ext = ext[1];	
	}
	else{
		ext = "unknown";
	}
	win.codeType = ext;	
	win.LoadProgram(fname, ext);
}

CncUI.ShowCncProg = function (fname) {
	var win = DOM(".window.program-editor.prototype").clone();
	win.set("@title", fname);
	DOM.add(win);
	ProgramEditor.Init(win);
	Win.CreateWindow(win);
	var ext = fname.split('.');
	if (ext[1]){
		ext = ext[1];	
	}
	else{
		ext = "unknown";
	}
	win.codeType = ext;	
	win.storage = CncStorage;
	win.LoadProgram(fname, ext);
}

CncUI.ShowConfig = function (fname) {
	var win = DOM(".window.program-editor.prototype").clone();
	win.set("@title", fname);
	DOM.add(win);
	ProgramEditor.Init(win);
	Win.CreateWindow(win);
	var ext = fname.split('.');
	if (ext[1]){
		ext = ext[1];	
	}
	else{
		ext = "unknown";
	}
	win.codeType = ext;	
	win.storage = ConfigStorage;
	win.LoadProgram(fname, ext);
};

CncUI.ShowProgram = function (fname) {
	var win = DOM(".window.program-editor.prototype").clone();
	win.set("@title", fname);
	DOM.add(win);
	ProgramEditor.Init(win);
	Win.CreateWindow(win);
	var ext = fname.split('.');
	if (ext[1]){
		ext = ext[1];	
	}
	else{
		ext = "unknown";
	}
	win.codeType = ext;
	win.storage = ProgStorage;
	win.LoadProgram(fname, ext);
};

CncUI.CreateNewProgram = function(){
	var win = DOM(".window.program-editor.prototype").clone();
	win.set("@title", "New program");
	DOM.add(win);
	ProgramEditor.Init(win);
	Win.CreateWindow(win);	
};


CncUI.RunProgram = function () {
	if (cnc.ProgramCode) {
		cnc.SendProgram(cnc.ProgramCode);
	}
};


CncUI.QuickProgram = function(fpath){
	this.LoadProgram(fpath, function(text){
		text = CncCompiler.Compile(cnc.Settings, text, { x: lx, y : ly, z: lz, speed : cnc.Settings.speed });
		text = PostCompiler.ProcessCode(text);
		if (text){
			cnc.SendProgram(text);
		}	
	});	
};

ProgramEditor = {};

ProgramEditor.Init = function(win, ext){
	Extend(win, this);
	win.editArea = win.get(".content");	
	if (!win.storage) win.storage = Storage;
};

ProgramEditor.SaveProgram = function(){
	var win = this;
	var text = this.editor.getValue();
	win.storage.POST(win.fname, text, function(){
		win.get(".window_title").set(win.fname);
	});
};

ProgramEditor.LoadProgram = function(fname, ext){
	var win = this;
	win.codeType = ext;
	win.fname = fname;
	win.storage.get(fname + "?rnd=" + Math.random(), function(result){
		var parsers = "text/plain";
		if (ext != null) {
			if (ext == "html"){
				parsers = "text/html";
			}
			if (ext == "svg"){
				parsers = "xml";
			}
			if (ext == "css"){
				parsers = "text/css";
			}
			if (ext == "js") {
				parsers = "application/javascript";
				win.get(".compile-btn").hide();
				win.get(".run-btn").show();
			}
			if (ext == "json") {
				parsers = "application/json";
			}
		}
		var editor = CodeMirror(win.editArea, {
			mode: parsers,
			indentUnit: 4,
			wordWrap: true,
			indentWithTabs: true,
			smartIndent: true,
			lineNumbers: true,
			matchBrackets: true,
			matchTags: true,
			autoCloseBrackets : true,
			highlightSelectionMatches: true,
			autoCloseTags: true,
			electricChars: true
		});
		editor.setValue(result);
		win.editor = editor;
	}, null, true);//PREVENT PARSING!
};

ProgramEditor.Compile = function(){
	var compiler = Compilers[this.codeType];
	if (compiler){
		var text = this.editor.getValue();
		cnc.ProgramCode = compiler.Compile(cnc.Settings, text, { x: lx, y : ly, z: lz, speed : cnc.Settings.speed });
		PostCompiler.ShowCode(cnc.ProgramCode);
		Preview.ShowCode(cnc.ProgramCode);
	}
};

ProgramEditor.Run = function(){
	var text = this.editor.getValue();
	eval(text);
};

WS.DOMload(CncUI.InitCncUI);