Settings = {
	
	LoadProgram : function(){		
		var progs = localStorage["RoboPlatform_CurrentProg"];
		if (!progs) return null;
		return JSON.parse(progs);
	},	
	
	SaveProgram : function(prog){
		delete prog.flat;
		localStorage["RoboPlatform_CurrentProg"] = JSON.stringify(prog);		
	},
	
	Load : function(){
		var settings = localStorage["RoboPlatform_Settings"];
		if (!settings){
			this.loadDefault();
			return null;
		}
		settings = JSON.parse(settings);
		for (var item in settings){
			this[item] = settings[item];
		}
	},	
	
	loadDefault : function(){
		this.timeCoef = 1;
		this.rowsCount = 3;
		this.colsCount = 100;
		this.firstUse = true;
	},
	
	Save : function(){
		this.firstUse = false;
		localStorage["RoboPlatform_Settings"] = JSON.stringify(this);
	}
};