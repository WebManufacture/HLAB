
CManager = {};

CManager._mixin = {
	InitElem : function(){
		this.Fill();
		var hrow = this.get("#row0");
		hrow.add(".header");
		var cells = hrow.all(".cell");
		for (var i = 0; i < cells.length; i++){
			cells[i].textContent = i;	
		}
		var cells = this.all(".cell[col='0']");
		for (var i = 1; i < cells.length; i++){
			cells[i].textContent = i ;	
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
			row.add(this._initCell(i, rnum, row));
		}
		return row;
	},

	_initCell: function(col, row, rowElem){
		var cell = DOM.div(".cell", "&nbsp;");
		cell.id = "cell" + row + "_" + col;
		cell.set("@col", col);
		cell.set("@row", row);
		cell.row = row;
		cell.col = col;
		cell.value = 0;
		cell.draggable = true;
		var table = this;
		cell.addEventListener("click", function(event){
			table._onCellClick.call(this, event, table);
			table.emit("cell_click", this, event);
		});	
		cell.addEventListener("mouseenter", function(event){
			table._onCellEnter.call(this, event, table);
			table.emit("cell_enter", this, event);
		});
		cell.addEventListener("mouseover", function(event){
			table.emit("cell_hover", this, event);
		});
		cell.addEventListener("dragenter", function(event){
			table._onCellEnter.call(this, event, table);
			table.emit("cell_over", this, event);
		});
		cell.addEventListener("onmouseleave", function(event){
			table._onCellLeave.call(this, event, table);
		});
		if (col == 0 && row > 0){
			cell.addEventListener("click", function(event){
				table._selectRow.call(this, table, rowElem);
			});
		}
		return cell;
	},

	GetCell : function(rowNum, colNum){
		return this.get('#cell' + rowNum + "_" + colNum);
	},
	
	ActivateCell : function(rowNum, colNum){
		var cell = this.get('#cell' + rowNum + "_" + colNum);
		if (cell){
			cell.click();
		}
	},
	
	SelectRow : function(rowNum){
		var row = this.get('#row' + rowNum);
		if (row){
			row.add(".selected");
		}
	},
	
	UnSelectRow : function(rowNum){
		var row = this.get('#row' + rowNum);
		if (row){
			row.del(".selected");
		}
	},
	
	MarkCol : function(colNum){
		this.all(".cell[col='" + colNum + "']").add(".marked");
	},
	
	UnMarkCol : function(colNum){
		this.all(".cell[col='" + colNum + "']").del(".marked");
	},
	
	_selectRow : function(table, row){
		WS.ToggleClass(row,"selected");	
		if (row.is(".selected")){
			table.emit("row_selected", row);
		}
		else{
			table.emit("row_unselected", row);
		}
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
	},


	_onCellEnter : function(event, table){
		if (this.col <= 0) return;
		if (this.row == 0){		
			return;
		}
		var hcol = table.get(".row.header .cell[col='" + this.col + "']"); 
		if (hcol){
			table.all(".row.header .cell.current").del(".current");	
			hcol.add(".current");
		}
		table.all(".cell.targeted").del(".targeted");
		table.all(".cell[col='" + this.col + "']").add(".targeted");
	},

	_onCellLeave : function(event, table){
		if (this.col <= 0) return;
		table.all(".cell.targeted").del(".targeted");
	},
};

CManager.Init = function(table, options){
	Extend(table, Channel.prototype);	
	Extend(table, CManager._mixin);
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
	table.InitElem();
	return table;
};