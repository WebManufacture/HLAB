PUI = {}; 

PUI.Init = function(cells){ 
	PUI.Grid = cells;
	cells.on("cell_click", PUI.cellActivate); 
	cells.on("cell_over", PUI.cellOver); 
	cells.on("cell_enter", PUI.onCellEnter);
	cells.on("row_selected", function(m, row){
		LineEditor.show();
		var prog = PUI.GetPortProgram(row.number);
		prog = Device.CompilePort(prog);
		LineEditor.ShowProg(prog);
	}); 
	cells.on("row_unselected", function(){
		LineEditor.hide();
	}); 
	PUI.CurrentTool = 'Pencil'; 
	ProgramWin.editor = ProgramWin.get(".program-text");
	DOM.all(".menuitem[switch-group=tool]").each(function(item){ 
		item.addEventListener("click", PUI.selectTool); });
}  

PUI.Load = function(){ 
	Settings.Load();	
	PUI.loadUISettings();
	CellField.SetFieldSize(Settings.colsCount, Settings.rowsCount);
	TimeCoeffBox.innerHTML = Settings.timeCoef + "x";
	var prog = Settings.LoadProgram();
	if (prog){
		PUI.SetProgram(prog);
	}
}

PUI.Save = function(){ 
	Settings.Save();	
	Settings.SaveProgram(PUI.GetProgram());
}

PUI.SaveSettingsClick = function(){
	var tc = parseFloat(TimeCoefficientSetting.value);
	if (!isNaN(tc)){
		Settings.timeCoef = tc;
		TimeCoeffBox.innerHTML = tc + "x";
	}
	var cc = parseFloat(ColsCountSetting.value);	
	var rc = parseFloat(RowsCountSetting.value);
	if (!isNaN(cc) && !isNaN(rc) && (cc != Settings.colsCount || rc != Settings.rowsCount)){
		CellField.SetFieldSize(cc, rc);
	}
	if (!isNaN(cc) && cc != Settings.colsCount){
		Settings.colsCount = cc;		
	}
	if (!isNaN(rc)){
		Settings.rowsCount = rc;
	}
	Settings.Save();	
	UiSettingsWindow.Hide();
}

PUI.loadUISettings = function(){
	TimeCoefficientSetting.value = Settings.timeCoef;
	ColsCountSetting.value = Settings.colsCount;	
	RowsCountSetting.value = Settings.rowsCount;	
}

PUI.selectTool = function(event){ 
	PUI.CurrentTool = this.get("@tool");
	if (PUI.currentMarkedRow && PUI.currentMarkedCol){
		PUI.Grid.UnSelectRow(PUI.currentMarkedRow);
		PUI.Grid.UnMarkCol(PUI.currentMarkedCol);
		PUI.currentMarkedRow = null;
		PUI.currentMarkedCol = null;
	}
} 


PUI.onCellEnter = function (message, cell, event){
	CoordDisplay.set("Ch: " + cell.row + " T: " + cell.col);				
}


PUI.cellOver = function(message, cell, event){ 
	if (PUI.CurrentTool == 'Pencil'){ 
		PUI.cellActivate.call(this, message, cell, event); 
	}
} 

PUI.setCellValue = function(cell, value){
	if (typeof(value) != "number" && value != null){
		cell.set("C");
		cell.del(".on");
		cell.del(".off");
		cell.del(".valued");
		cell.add(".command");
		
		cell.value = value;
		return;
	}
	if (value){
		if (value == 100){
			cell.add(".on");
			cell.del(".valued");
			cell.del(".off");
			cell.title = "100%";
			cell.set("@style", "");
		}
		else{

			cell.del(".on");
			cell.del(".off");
			cell.add(".valued");
			cell.title = value + "%";
			var v = parseInt(value*255/100);
			var r = 255 - parseInt(value*255/100);
			var g = 120 + parseInt((100 - value)*135/100);
			var b = 200 - parseInt((100 - value)*200/100);
			cell.style.backgroundColor = "rgb(" + r + "," + g + "," + 120 + ")";
		}
		cell.value = value;
		cell.set("@value", value);
	}
	else{
		if (value == null){
			cell.del(".off");
		}
		else{
			cell.add(".off");
		}
		cell.del(".on");
		cell.del(".valued");
		cell.title = "0%";
		cell.set("@style", "");
		cell.value = 0;
		cell.set("@value", 0);
	}
}

PUI.cellActivate = function(message, cell, event){
	if (PUI.antiRecursion) return;
	if (cell.row == 0 || cell.col == 0) return
	if (PUI.CurrentTool == 'Pencil'){
		PUI.setCellValue(cell, ValueEditor.Value);
	}
	if (PUI.CurrentTool == 'Pitch'){
		PUI.setCellValue(cell, typeof(cell.value) != "number" || cell.value > 0 ? 0 : 100);
	}
	if (PUI.CurrentTool == 'Lines'){
		if (PUI.currentMarkedRow && PUI.currentMarkedCol){
			PUI.antiRecursion = true;
			PUI.Grid.UnSelectRow(PUI.currentMarkedRow);
			PUI.Grid.UnMarkCol(PUI.currentMarkedCol);
			var er = cell.row;
			if (cell.row < PUI.currentMarkedRow){
				var er = PUI.currentMarkedRow;
				PUI.currentMarkedRow = cell.row;
			}
			var ec = cell.col;
			if (cell.col < PUI.currentMarkedCol){
				var ec = PUI.currentMarkedCol;
				PUI.currentMarkedCol = cell.col;
			}
			for(var r = PUI.currentMarkedRow; r <= er; r++){
				for(var c = PUI.currentMarkedCol; c <= ec; c++){
					PUI.setCellValue(PUI.Grid.GetCell(r, c), ValueEditor.Value);
				}
			}			
			PUI.currentMarkedRow = null;
			PUI.currentMarkedCol = null;
			PUI.antiRecursion = false;
		}
		else{
			PUI.currentMarkedRow = cell.row;
			PUI.currentMarkedCol = cell.col;
			PUI.Grid.SelectRow(cell.row);
			PUI.Grid.MarkCol(cell.col);
		}
		if (!PUI.linesUsed){
			PUI.linesUsed = true;
			if (Settings.firstUse){
				LinesHelpWindow.style.left = event.clientX + "px";
				LinesHelpWindow.style.top = event.clientY + "px";
				LinesHelpWindow.Show();
			}
		}
	}
}

PUI.GetPortProgram = function(pNum){	
	if (!pNum) return;
	var prog = [];
	var last = 0;
	for (var c = 1; c <= PUI.Grid.Cols; c++ ){		
		var cell = PUI.Grid.GetCell(pNum, c);			
		if (last != cell.value){
			last = cell.value;
			prog.push({ sec : c, value: cell.value});
		}
	}	
	return prog;
}

PUI.GetProgram = function(pNum){	
	var lastStates = [{}];
	var progs = [];

	for (var r = 1; r <= PUI.Grid.Rows; r++ ){
		lastStates[r] = 0;
		progs[r-1] = null;
	}

	var last = null;
	var flat = [];

	for (var c = 1; c <= PUI.Grid.Cols; c++ ){		
		for (var r = 1; r <= PUI.Grid.Rows; r++ ){
			var cell = PUI.Grid.GetCell(r, c);			
			if (lastStates[r] != cell.value){
				lastStates[r] = cell.value;
				if (!progs[r-1]) progs[r-1] = [];
				last = { sec : c, value: cell.value};
				progs[r-1].push(last);
				flat.push({ sec : c, value: cell.value, port : r});
			}
		}
	}

	progs.flat = flat;
	return progs;
}

PUI.SetProgram = function(progs){	
	CellField.SetFieldSize(Settings.colsCount, Settings.rowsCount);
	if (progs){		
		for (var port = 1; port <= progs.length; port++ ){
			var prog = progs[port-1];	
			if (!prog) continue;
			var lastProg = 0;
			var searchSec = prog[lastProg].sec;
			if (searchSec == 0) searchSec = 1;
			var curVal = prog[lastProg].value;
			for (var c = searchSec; c <= PUI.Grid.Cols; c++ ){	
				if (searchSec == c){					
					curVal = prog[lastProg].value;
					lastProg++;
					if (prog.length >= lastProg + 1){
						searchSec = prog[lastProg].sec;
					}
				}			
				var cell = PUI.Grid.GetCell(port, c);
				if (curVal != 0){
					PUI.setCellValue(cell, curVal);
				}
				else{
					PUI.setCellValue(cell, null);
				}
			}
		}
	}
}

PUI.ShowProgram = function(){
	var prog = Device.Compile(PUI.GetProgram());
	var win = ProgramWin;
	win.Show();
	var txt = "";
	for (var i = 0; i < prog.length; i++ ){
		var p = prog[i];
		txt += "P" + p.port + " V" + p.value + " S" + p.sec + "\n";
	}	
	win.get(".program-text").value = txt;
	pwinStatus.set("Summary: " + prog.length + " commands\n")
};

PUI.DecompileProgram = function(){
	var win = ProgramWin;
	var prog = win.editor.value;
	if (!prog) return [];
	var result = [];
	prog = prog.split("\n");/*
	var txt = "";
	for (var i = 0; i < prog.length; i++ ){
		var p = prog[i];
		txt += "P" + p.port + " V" + p.value + " S" + p.sec + "\n";
	}	
	 = txt;
	pwinStatus.set("Summary: " + prog.length + " commands\n")
	*/
	return result;
};

PUI.Clear = function(){
	for (var r = 1; r <= PUI.Grid.Rows; r++ ){
		for (var c = 1; c <= PUI.Grid.Cols; c++ ){	
			var cell = PUI.Grid.GetCell(r, c);
			PUI.setCellValue(cell, null);
		}
	}
}


