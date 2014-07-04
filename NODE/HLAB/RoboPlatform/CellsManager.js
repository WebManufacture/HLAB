CManager = function(table, options){
	Extend(table, CManager._mixin);
	Extend(table, Channel.prototype);
	Channel.prototype.constructor.call(table);
	
	table.Cols = parseInt(table.get("@columns"));
	table.Rows = parseInt(table.get("@rows"));
	table.CellSize = parseInt(table.get("@cellsize"));
	
	if (options && options.cols){
		table.Cols = options.cols;
	}
	if (options && options.rows){
		table.Rows = options.rows;
	}
	if (options && options.width){
		table.CellSize = options.width;
	}
	
	table.IDiv = table.div(".internal");
	var isize = ((table.CellSize) * (table.Cols + 1));
	table.IDiv.set("@style", "width : " + isize + "px;");
	table.add(".initialized");
	for (var item in table){
		if (item.indexOf("on") == 0 && typeof(table[item]) == 'function'){
			table.on(item.replace("on", '').toLowerCase(), table[item]);
		}
	}
	table.Init();
	return table;
};

CManager._mixin = {
	Init : function(){
		this.Fill();
		var hrow = this.get("#row0");
		hrow.add(".header");
		var cells = hrow.all(".cell");
		for (var i = 0; i < cells.length; i++){
			cells[i].textContent = i + 1;	
		}
		var cells = this.all(".cell[col='0']");
		for (var i = 1; i < cells.length; i++){
			cells[i].textContent = i;	
			cells[i].add(".gutter");
		}
		this.emit("init");
	},
	
	Fill : function(){
		this.all(".cell").del();
		for (var i = 0; i < this.Rows + 1; i++){
			var row = this.CreateRow(i);
		}
	},
	
	CreateRow: function(rnum){
		var row = this.IDiv.div(".row");
		row.id = "row" + rnum;
		for (var i = 0; i < this.Cols + 1; i++){
			row.add(this._initCell(i, rnum));
		}
		return row;
	},
		
	_initCell: function(col, row){
		var cell = DOM.div(".cell", "&nbsp;");
		cell.id = "cell" + row + "_" + col;
		cell.set("@col", col);
		cell.set("@row", row);
		cell.row = row;
		cell.col = col;
		cell.value = 0;
		var table = this;
		cell.onclick = function(event){
			table._onCellClick.call(this, event, table);
			table.emit("cellClick", this);
		};		
		cell.onmouseenter = function(event){
			table._onCellEnter.call(this, event, table);
		};		
		return cell;
	},
	
	_onCellClick : function(event, table){
		if (this.col <= 0){
			table.emit("gutter_click", this);
			return;
		}
		if (this.row <= 0){
			table.emit("header_click", this);
			return;
		}
		WS.ToggleClass(this,"selected");	
		if (this.is(".selected")){
			table.emit("cell_selected", this);
		}
		else{
			table.emit("cell_unselected", this);
		}
	},


	_onCellEnter : function(event, table){
		if (this.col <= 0 || this.row <= 0) return;
		var hcol = table.get(".row.header .cell[col='" + this.col + "']"); 
		if (hcol){
			table.all(".row.header .cell.current").del(".current");	
			hcol.add(".current");
		}
		if (event.buttons == 1){
			WS.ToggleClass(this, "selected");
			if (this.is(".selected")){
				table.emit("cell_selected", this);
			}
			else{
				table.emit("cell_unselected", this);
			}
		}
	},
};

C.Add({id: 'CellsManagerContext', Condition: 'ui-processing', Selector:'.cells-manager:not(.initialized)', Process: function(elem){
	CManager(elem);
}});
