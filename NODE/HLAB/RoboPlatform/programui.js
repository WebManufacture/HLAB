PUI = {}; 

PUI.Init = function(cells){ 
	PUI.Grid = cells;
	cells.on("cell_click", PUI.cellActivate); 
	cells.on("cell_over", PUI.cellOver); 
	//cells.on("cell_hover"); 
	PUI.CurrentTool = 'Pencil'; 
	DOM.all(".menuitem[switch-group=tool]").each(function(item){ 
		item.addEventListener("click", PUI.selectTool); });
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

PUI.cellOver = function(message, cell, event){ 
	if (PUI.CurrentTool == 'Pencil'){ 
		PUI.cellActivate.call(this, message, cell, event); 
	}
} 

PUI.setCellValue = function(cell, value){
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
	if (PUI.CurrentTool == 'Pencil' || PUI.CurrentTool == 'Pitch' ){
		PUI.setCellValue(cell, ValueEditor.Value);
	}
	if (PUI.CurrentTool == 'Lines'){
		if (event.ctrlKey && PUI.currentMarkedRow && PUI.currentMarkedCol){
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
			PUI.currentMarkedRow = cell.row;
			PUI.currentMarkedCol = cell.col;
			PUI.antiRecursion = false;
		}
		else{
			if (PUI.currentMarkedRow && PUI.currentMarkedCol){
				PUI.Grid.UnSelectRow(PUI.currentMarkedRow);
				PUI.Grid.UnMarkCol(PUI.currentMarkedCol);
			}
			PUI.currentMarkedRow = cell.row;
			PUI.currentMarkedCol = cell.col;
			PUI.Grid.SelectRow(cell.row);
			PUI.Grid.MarkCol(cell.col);
		}

		if (!PUI.linesUsed){
			PUI.linesUsed = true;
			LinesHelpWindow.style.left = event.clientX + "px";
			LinesHelpWindow.style.top = event.clientY + "px";
			LinesHelpWindow.Show();

		}
	}
}

PUI.GetProgram = function(){
	var progs = {};

	progs.flat = [];
	
	var lastStates = [];

	var commands = 0;
	
	for (var r = 1; r <= PUI.Grid.Rows; r++ ){
		lastStates[r-1] = { sec : 0, value: PUI.Grid.GetCell(r, 1).value};
		progs[r] = [];
		progs[r].push(lastStates[r-1]);
		progs.flat.push({ port: r, sec : 0, value: PUI.Grid.GetCell(r, 1).value});
		commands++;
	}	

	for (var c = 2; c <= PUI.Grid.Cols; c++ ){		
		for (var r = 1; r <= PUI.Grid.Rows; r++ ){
			var cell = PUI.Grid.GetCell(r, c);
			if (lastStates[r-1].value != cell.value){
				lastStates[r-1] = { sec : c, value: cell.value};
				progs[r].push(lastStates[r-1]);
				progs.flat.push({ sec : c, value: cell.value, port: r});
				commands++;
			}
		}
	}

	progs.commands = progs.flat.length;
	
	return progs;
}

PUI.Save = function(){	
	var prog = PUI.GetProgram();
	localStorage["RoboPlatform_CELLS_CurrentProg"] = JSON.stringify(prog);
}


PUI.Load = function(){	
	var progs = localStorage["RoboPlatform_CELLS_CurrentProg"];
	if (!progs) return;
	progs = JSON.parse(progs);
	if (progs){		
		for (var r = 1; r <= PUI.Grid.Rows; r++ ){
			var prog = progs[r];
			var lastProg = 0;
			var searchSec = prog[lastProg].sec;
			if (searchSec == 0) searchSec = 1;
			var curVal = prog[lastProg].value;
			for (var c = 1; c <= PUI.Grid.Cols; c++ ){	
				if (searchSec == c){					
					curVal = prog[lastProg].value;
					lastProg++;
					if (prog.length >= lastProg + 1){
						searchSec = prog[lastProg].sec;
					}
				}			
				var cell = PUI.Grid.GetCell(r, c);
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

PUI.Clear = function(){
	for (var r = 1; r <= PUI.Grid.Rows; r++ ){
		for (var c = 1; c <= PUI.Grid.Cols; c++ ){	
			var cell = PUI.Grid.GetCell(r, c);
			PUI.setCellValue(cell, null);
		}
	}
}
