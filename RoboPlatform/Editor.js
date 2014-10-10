ProgramEditor = {};

ProgramEditor.Init = function(win){
	Extend(win, this);
	win.editor = win.get(".program-text");	
	ProgramEditor.Win = win;
};

ProgramEditor.SaveProgram = function(){
	var win = this;
	var text = this.editor.value;
	var lines = text.split("\n");
	if (lines.length > 0 && lines[0].start("#")){
		var fname = lines[0].replace("#", '');
		var ext = fname.split('.');
		if (ext[1]){
			ext = ext[1];	
		}
		else{
			ext = "unknown";
		}
		this.codeType = ext;
		Storage.POST("programs/" + fname, text, function(){
			win.get(".window_title").set(fname);
		});
	}
};

ProgramEditor.LoadProgram = function(prog){
	var win = ProgramEditor.Win;
	console.log(prog);
	win.Show();
	var txt = "Summary: " + prog.commands + " commands\n";
	for (var i = 0; i < prog.flat.length; i++ ){
		var p = prog.flat[i];
		txt += p.port + ": " + p.sec + " - " + p.value + "\n";
	}	
	win.editor.value = txt;
	/*Storage.get("programs/" + fname + "?rnd=" + Math.random(), function(result){
		win.editor.value = result;
	});*/
};

ProgramEditor.Compile = function(){
	var compiler = Compilers[this.codeType];
	if (compiler){
		var text = this.editor.value;
		CNC.ProgramCode = compiler.Compile(CNC.Settings, text, { x: lx, y : ly, z: lz, speed : CNC.Settings.speed });
		PostCompiler.ShowCode(CNC.ProgramCode);
		Preview.ShowCode(CNC.ProgramCode);
	}
};

