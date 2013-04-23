var fs = require('fs');
var paths = require('path');
var ChildProcess = require('child_process');

module.exports = function(config, server){
	log = server.Logger;
	if (!config){
		config = Server.Config;
	}
	ForksRouter.Path = config.path;
	if (config.forks){
		for (var fpath in config.forks){
			var fork = config.forks[fpath];
			var file = "server.js";
			var args = fork;
			if (typeof(fork) == "object"){
				args = fork.args;
				if (fork.file){
					file = fork.file;	
				}
			}
			var cf = Forks[fpath];
			if (!cf){		
				cf = Forks[fpath] = new Fork(file, args);
			}	
			if (args){
				cf.start(args);
			}
		}
	}
	return ForksRouter;
};

Forks = { };

function Fork(path, args){
	this.path = path;
	if (!args) args = [];
	this.args = args;
	this.code = 0;
	return this;
};

Fork.Statuses = ["new", "stoped", "exited", "reserved", "reserved", "reserved", "reserved", "working"];

Fork.STATUS_NEW = 0;
Fork.STATUS_STOPED = 1;
Fork.STATUS_EXITED = 2;
Fork.STATUS_WORKING = 7;

Fork.prototype = {
	toString : function(){
		return JSON.stringify(this.status());
	},
	
	reset : function(args){
		this._log("server", "reset");
		if (this.code < Fork.STATUS_WORKING){
			return this.start();
		};	
		var fork = this;
		if (!args) args = this.args;
		this.process.on("exit", function(){
			fork.start(args);
		});
		this.stop();
		return this.process;
	},
	
	start : function(args){
		if (this.code >= Fork.STATUS_WORKING){
			return;	
		}		
		if (!args) args = this.args;
		if (typeof (args) == 'string'){
			args = JSON.parse(args);	
		}
		var cp = this.process = ChildProcess.fork(this.path, args, { silent: false });
		this._log("server", "started");
		this.code = Fork.STATUS_WORKING;		
		var fork = this;
		cp.on("exit", function(){
			fork._exitEvent.apply(fork, arguments);
		});
		cp.on("message", function(){
			fork._messageEvent.apply(fork, arguments);
		});
		return cp;
	},
	
	stop : function(){
		if (this.code < Fork.STATUS_WORKING){
			return;	
		}
		this.process.kill();
		this._log("server", "stoped");
		return this.process;
	},
	
	status : function(){
		var stat = {code : this.code, status : Fork.Statuses[this.code], log : this.logFile, path: this.path, args: this.args};
		if (this.process){
			stat.pid = this.process.pid;	
		}
		return stat;
	},
	
	_exitEvent : function(signal){
		this.code = Fork.STATUS_EXITED;
		this._log("server", "exited");
	},
	
	
	_messageEvent : function(message){
		if (typeof message == "string"){
			this._log("message", message);
		}
		else{
			if (message.type){
				this._log(message.type, message.text);	
				return;
			}
		}
	},
	
	_errEvent : function(message){
		this._log("error", "message");
	},
	
	_outEvent : function(signal){
		this._log("info", "message");
	},
	
	_log : function(type, message){
		log._log(type, message, this.path);
	},
	
	close : function(){
		if (this.process){
			this._log("server", "close");
			this.process.kill();
		}
	}
};

ForksRouter = {
	
};

ForksRouter.GET = ForksRouter.HEAD = function(context){	
	var fpath = context.pathTail.replace("/", "\\");
	var fork = Forks[fpath];
	if (fork){
		context.res.setHeader("Content-Type", "application/json; charset=utf-8");
		context.finish(200, fork.toString());	
	}
	else{
		context.finish(404, "Fork not found");
	}		
	return true;
};

ForksRouter.SEARCH = function(context){
	var forks = {};
	for (var fork in Forks){
		forks[fork] = Forks[fork].status();
	}
	context.res.setHeader("Content-Type", "application/json; charset=utf-8");
	context.finish(200, JSON.stringify(forks));
	return true;
};


ForksRouter.POST = function(context){
	var fpath = context.pathTail.replace("/", "\\");
	var fullData = "";
	context.req.on("data", function(data){
		fullData += data;		
	});
	context.req.on("end", function(){
		try{
			var data = JSON.parse(fullData);
			if (!data){ data = {} };
			var ext = paths.extname(data.file);
			ext = ext.replace(".", "");
			if (ext != "js"){
				context.error("Can't fork not javascript files");
				return false;
			}
			var cf = Forks[fpath];
			if (!cf){
				if (!data.file){
					data.file = "server.js";
				}
				context.log("Starting ", data.file, " with ", data.args);
				cf = Forks[fpath] = new Fork(data.file, data.args);
				cf.start();
			}	
			else{
				if (data.file){
					cf.path = data.file;	
				}
				context.log("Resetting ", cf.path, " with ", data.args);
				cf.reset(data.args);
			}			
			context.res.setHeader("Content-Type", "application/json; charset=utf-8");
			context.finish(200, cf.toString());
			context.continue();
		}
		catch(e){
			context.error(e);
			return;
		}
	});
	return false;
};

ForksRouter.DELETE = function(context){
	var fpath = context.pathTail.replace("/", "\\");
	var cf = Forks[fpath];
	if (cf){		
		cf.stop();
	}
	context.res.setHeader("Content-Type", "application/json; charset=utf-8");
	context.finish(200, cf.toString());
	return true;
};

