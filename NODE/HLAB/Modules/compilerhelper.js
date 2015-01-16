CompilerHelper = {
	CompilerURL : "http://hlab.web-manufacture.net:8099",
	
	parseResponse : function(text){
		var res = DOM.div(text);
		var errCode = res.get("#ErrCode").get();
		var errOut = res.get("#ErrOut").get();
		var stdOut = res.get("#StdOut").get();
		var objFiles = res.get("#ObjFiles").get();
		var lstFiles = res.get("#LstFiles").get();
		var errFiles = res.get("#ErrFiles").get();
		return {
			errCode : parseInt(errCode),
			errOut : errOut,
			stdOut : stdOut,
			objFiles : objFiles.split(','),
			errFiles : errFiles.split(','),
			lstFiles : lstFiles.split(','),
			errors : errOut.split("\n")
		}
	},
	
	Compile : function(path, callback){
		var url = "http://hlab.web-manufacture.net:8099" + path + "?action=compile";
		Net.get(url, function(result){
			if (callback){
				var obj =  CompilerHelper.parseResponse(result);
				obj.errOut = obj.errOut.replace(/#error cpstm8 /ig, ""); 
				callback(result,obj);
			}
		});
	},
	
	CompileFile : function(path, callback){
		var url = "http://hlab.web-manufacture.net:8099" + path + "?action=compile";
		Net.get(url, function(result){
			if (callback){
				var obj =  CompilerHelper.parseResponse(result);
				obj.errOut = obj.errOut.replace(/#error cpstm8 /ig, ""); 
				callback(result,obj);
			}
		});
	},
	
	Link : function(path, callback){
		var url = "http://hlab.web-manufacture.net:8099" + path + "?action=link";
		Net.get(url, function(result){
			if (callback){
				var obj =  CompilerHelper.parseResponse(result);
				obj.errOut = obj.errOut.replace(/#error clnk /ig, ""); 
				callback(result,obj);
			}
		});
	}
};

