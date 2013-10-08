var paths = require('path');
require(paths.resolve('./Modules/Channels.js'));
log = require(paths.resolve('./Modules/Logger.js')).log;
error = require(paths.resolve('./Modules/Logger.js')).error;
info = require(paths.resolve('./Modules/Logger.js')).info;
debug = require(paths.resolve('./Modules/Logger.js')).debug;

global.ContextChannelsClient = {	
	GET :  function(context){
		if (context.completed){
			return true;	
		}
		var path = context.pathTail.trim();
		var response = context.res;
		var request = context.req;
		if (path.lastIndexOf("/") == path.length - 1){
			path = path.substring(0, path.length - 1);
		}
		//console.log("SENDING event ".info + path);
		var handler = function(message){
			try{
				var params = [];
				for (var i = 0; i < arguments.length; i++){
					//if (arguments[i].length && arguments[i].length > 100) params.push("Long param: " + arguments[i].length);
					params.push(arguments[i]);
				}
				response.write(JSON.stringify(params) + "\n");
			}
			catch(e){
				response.write(JSON.stringify(e) + "\n");
			}
		}
		request.on("close", function(){
			Channels.clear(path, handler);
		});
		if (Channels.exists(path)){
			Channels.on(path, handler);
			response.setHeader("Content-Type", "application/json; charset=utf-8");		
			context.abort();
			return false;
		}
		else{
			context.finish(403, "handler not registered");
			return true;
		}
	},

	POST : function(context){
		if (context.completed){
			return true;	
		}
		var path = context.pathTail.trim();
		if (path.lastIndexOf("/") == path.length - 1){
			path = path.substring(0, path.length - 1);
		}
		var response = context.res;
		var request = context.req;
		var fullData = "";		
		response.setHeader("Content-Type", "application/json; charset=utf-8");
		request.on("data", function(data){
			fullData += data;		
		});
		request.on("end", function(){
			console.log(path);
			Channels.emit(path, JSON.parse(fullData), url, headers);
			context.finish(200);
			context.continue();
		});		
		return false;
	},

	SEARCH :  function(context){
		if (context.completed){
			return true;	
		}
	},
}

global.HttpChannelsClient = {	
	GET :  function(request, response, url){
		var path = url.pathname.trim();
		if (path.lastIndexOf("/") == path.length - 1){
			path = path.substring(0, path.length - 1);
		}
		var handler = function(message){
			try{
				var params = [];
				for (var i = 0; i < arguments.length; i++){
					//if (arguments[i].length && arguments[i].length > 100) params.push("Long param: " + arguments[i].length);
					params.push(arguments[i]);
				}
				response.write(JSON.stringify(params) + "\n");
			}
			catch(e){
				response.write(JSON.stringify(e) + "\n");
			}
		}
		request.on("close", function(){
			Channels.clear(path, handler);
		});		
		if (Channels.exists(path)){
			Channels.on(path, handler);
			response.setHeader("Content-Type", "application/json; charset=utf-8");		
			return true;
		}
		else{
			log("Channel not found: " + path, true);
			response.end(403, "Channel not found");	
			return false;
		}
	},

	POST : function(request, response, url){
		var path = url.pathname.trim();
		if (path.lastIndexOf("/") == path.length - 1){
			path = path.substring(0, path.length - 1);
		}
		var fullData = "";		
		response.setHeader("Content-Type", "application/json; charset=utf-8");
		request.on("data", function(data){
			fullData += data;		
		});
		request.on("end", function(){
			log(path);
			Channels.emit(path, JSON.parse(fullData), url, headers);
			response.end(200, "");	
		});		
		return true;
	},

	SEARCH :  function(context){
		if (context.completed){
			return true;	
		}
	},
}
module.exports = ContextChannelsClient;
	
