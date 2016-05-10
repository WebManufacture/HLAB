Config = {
	load : function(callback){
		var fs = require("fs");
		fs.readFile("./settings.json", function(err, data){
			if (err) data = "{}";
			data = JSON.parse(data);
			if (typeof callback == "function") callback(data);
		});
	}	
}