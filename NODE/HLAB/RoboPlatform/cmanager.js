
CManager = {};

CManager._mixin = {
	InitElem : function(){
		this.Fill();
		if (!this.is(".noheader")){
			var hrow = this.get("#row0");
			hrow.add(".header");
			var cells = hrow.all(".cell");
			for (var i = 0; i < cells.length; i++){
				cells[i].textContent = i;
				cells[i].add(".header-cell");
			}
		}
		if (!this.is(".nogutter")){
			var cells = this.all(".cell[col='0']");
			for (var i = 1; i < cells.length; i++){
				cells[i].textContent = i ;	
				cells[i].add(".gutter");
			}
		}
		this.emit("init");
	},

	Fill : function(){
		this.Clear();
		for (var i = 0; i < this.Rows + 1; i++){
			var row = this.CreateRow(i);
		}
	},
	
	Clear : function(){
		this.all(".row").del();
		this.all(".cell").del();
	},
	
	SetFieldSize : function(cols, rows){
		this.Clear();
		this.Cols = cols;
		this.Rows = rows;
		if (this.CellSize){
			var isize = ((this.CellSize) * (this.Cols + 1));
			this.IDiv.set("@style", "width : " + isize + "px;");
		}
		else{
			this.IDiv.set("@style", "width : 100%;");
		}
		this.InitElem();
	},
	
	AddCols : function(count){
		var hrow = this.get("#row0");
		for(var i = this.Cols + 1; i < this.Cols + count;i++){
			var hcell = hrow.add(this._initCell(i, 0, hrow));
			hcell.add(".header");
			hcell.textContent = i;
			for (var r = 1; r <= this.Rows; r++){
				var row = this.get("#row" + r);
				var cell = row.add(this._initCell(i, r, row));
			}
		};
		this.Cols += count;
		if (this.CellSize){
			var isize = ((this.CellSize) * (this.Cols + 1));
			this.IDiv.set("@style", "width : " + isize + "px;");
		}
	},
	
	AddRow : function(){
		var row = this.CreateRow(this.Rows + 1);
		var fcell = row.get(".cell[col='0']");
		this.Rows++;
		fcell.textContent = this.Rows;	
		fcell.add(".gutter");
		return row;
	},

	CreateRow: function(rnum){
		var row = this.IDiv.div(".row");
		row.id = "row" + rnum;
		row.number = rnum;
		if (this.CellSize){
			row.set("@style", "height : "+ this.CellSize + "px");			
		}
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
		if (this.CellSize){
			cell.set("@style", "width : " + this.CellSize + "px; height : "+ this.CellSize + "px");			
		}
		
		if (window.Drag){
			Drag.MakeDraggable(cell);
		}
		var table = this;
		
		if (col == 0 && row > 0){
			if (col <= 0){
				cell.addEventListener("click", function(event){
					table._selectRow.call(this, table, rowElem);
				});
			}
			if (row <= 0){
				cell.addEventListener("click", function(event){
					table.emit("col_selection", this);
				});
			}
		}
		else{
			cell.addEventListener("click", function(event){
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
			//this.emit("row_selected", row);
		}
	},
	
	UnSelectRow : function(rowNum){
		var row = this.get('#row' + rowNum);
		if (row){
			row.del(".selected");
			//this.emit("row_unselected", row);
		}
	},
	
	MarkCol : function(colNum){
		this.all(".cell[col='" + colNum + "']").add(".marked");
	},
	
	UnMarkCol : function(colNum){
		this.all(".cell[col='" + colNum + "']").del(".marked");
	},
	
	_selectRow : function(table, row){
		WS.ToggleClass(row, "selected");	
		if (row.is(".selected")){
			table.emit("row_selected", row);
		}
		else{
			table.emit("row_unselected", row);
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
	table.add(".initialized");
	for (var item in table){
		if (item.indexOf("on") == 0 && typeof(table[item]) == 'function'){
			table.on(item.replace("on", '').toLowerCase(), table[item]);
		}
	}
	table.InitElem();
	return table;
};