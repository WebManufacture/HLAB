CManager = {};

CManager.initElem = function(table) {
	Extend(table, CControl);
	Extend(table, CManager._mixin);
	Extend(table, Channel.prototype);
	Channel.prototype.constructor.call(table);
	table.Cols = parseInt(table.get("@columns"));
	table.Rows = parseInt(table.get("@rows"));
	table.CellSize = parseInt(table.get("@cellsize"));
	table.IDiv = table.div(".internal");
	var isize = ((table.CellSize) * table.Cols);
	table.IDiv.set("@style", "width : " + isize + "px;");
	table.Fill(table);
	table.add(".initialized");
	for (var item in table){
		if (item.indexOf("on") == 0 && typeof(table[item]) == 'function'){
			table.on(item.replace("on", '').toLowerCase(), table[item]);
		}
	}
	table.emit("init");
};

CManager._mixin = {
	Fill : function(table){
		table.all(".cell").del();
		for (var i = 1; i <= this.Rows; i++){
			var row = this.CreateRow(i);
		}
	},
	
	CreateRow: function(rnum){
		var row = this.IDiv.div(".row");
		row.id = "row" + rnum;
		for (var i = 1; i <= this.Cols; i++){
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
		var self = this;
		cell.onclick = function(){
			self.emit("cellClick", cell);
		};
		return cell;
	}
};

CControl = {
	onInit: function(){
		var hrow = this.get("#row1");
		hrow.add(".header");
		var cells = hrow.all(".cell");
		for (var i = 0; i < cells.length; i++){
			cells[i].textContent = i + 1;	
		}
		var cells = this.all(".row:not(.header) .cell");
		for (var i = 0; i < cells.length; i++){
			this.InitCell(cells[i]);	
		}

		var cells = this.all(".cell[col='1']");
		for (var i = 1; i < cells.length; i++){
			cells[i].textContent = i;	
		}
	},

	InitCell : function(cell){
		var table = this;
		cell.value = 0;
		cell.onmouseenter = function(event){
			table.onCellEnter.call(this, event, table);
		};
		cell.onmousedown = function(event){
			table.onCellDown.call(this, event, table);
		}
	},

	onCellDown : function(event, table){
		WS.ToggleClass(this,"selected");	
		if (this.is(".selected")){
			table.emit("cell_selected", this);
		}
		else{
			table.emit("cell_unselected", this);
		}
	},


	onCellEnter : function(event, table){
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

	onCell_Selected : function(message, cell){
		onCell_Selected(cell);
	},

	onCell_UnSelected : function(message, cell){
		onCell_UnSelected(cell);
	}

}

C.Add({id: 'CellsManagerContext', Condition: 'ui-processing', Selector:'.cells-manager:not(.initialized)', Process: function(elem){
	CManager.initElem(elem);
}});
