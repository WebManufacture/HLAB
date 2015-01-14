WS.DOMload(function(){
	LineEditor.ShowProg = function(prog){
		if (this.Cols < prog.length){
			this.AddCols(prog.length - this.Cols);
		}
		for (var i = 0; i < prog.length; i++){
			var cell = this.GetCell(1, i);
			cell.set(prog[i].command + "");
			cell.prg = prog[i];
			cell.set("@cmd", prog[i].command);
			cell.value = prog[i].value;
		}
		for (var i = 0; i < prog.length; i++){
			var cell = this.GetCell(2, i);
			cell.set(prog[i].value + "");
			cell.prg = prog[i];
			cell.set("@cmd", prog[i].command);
		}
	}
})