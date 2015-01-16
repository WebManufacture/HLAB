var http = require('http');
var Url = require('url');
var fs = require('fs');
var Path = require('path');
var ChildProcess = require('child_process');
/*
var COMPILE_CMD = 'cmd "%COSMIC%\\cxstm8" -i"%COSMIC%\\Hstm8" -i"%ST_TOOL%\\include" +mods0 +debug -e -pxp -l -pp *.c';
var COMPILE_FILE_CMD = 'cmd "%COSMIC%\\cxstm8" -i"%COSMIC%\\Hstm8" -i"%ST_TOOL%\\include" +mods0 +debug -e -pxp -l -pp %2';
var LINK_CMD = 'cmd "%COSMIC%\\clnk" -l"%COSMIC%\\Lib" -e"errors\\%2.merr" -sl  -o"result\\%2.sm8" -m"result\\%2.map" %2.lkf \n'+
			   'cmd "%COSMIC%\\cvdwarf" "result\\%2.sm8" \n'
			   'cmd "%COSMIC%\\chex" -o "result\\%2.s19" "result\\%2.sm8"'*/

var COMPILE_CMD = '%1\\Compile.cmd';
var COMPILE_FILE_CMD = '%1\\CompileFile.cmd';;
var LINK_CMD = '%1\\Link.cmd';

	function CreateServer(Port){
		console.log("STM8 Compiler Server on " + Port + "");
		Template = fs.readFileSync(".\\HLAB\\Template.lkf") + "";
		RespTemplate = fs.readFileSync(".\\HLAB\\ResponseTemplate.txt") + "";
		var httpServer = http.createServer(function(req,res){
			var port = Port;
			var host = req.headers.host;
			var url = "http://" + host + req.url;
			url = Url.parse(url.toLowerCase(), true);
			res.setHeader("Access-Control-Allow-Headers", "debug-mode,origin,content-type");
			res.setHeader("Access-Control-Expose-Headers", "content-type,debug-mode,Content-Type,ETag,Finish,Server,ServerUrl,ServiceUrl,ManageUrl,Date,Start,Load,Node,NodeId, NodeType");
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, PUT, POST, HEAD, OPTIONS, SEARCH");
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.finish = finish;
			Process(req, res, url, host, port);
		}).listen(Port);
		httpServer.on('error', function(err){
			console.error(err);
		});
	}

processCounter = 0;

function LaunchProcess(cmd, basePath, dirName, projectPath, errCallback){
	//var str = new Buffer("------------------------------------------------------------------\n" + new Date() + "\n");
	//var errLog = fs.openSync(basePath + "\\ErrLog.txt", "a");
	//fs.writeSync(errLog, str, 0, str.length, null);	
	//var outLog = fs.openSync(basePath + "\\OutLog.txt", "a");
	//fs.writeSync(outLog, str, 0, str.length, null);	
	var cp = ChildProcess.spawn(cmd,[basePath, dirName, projectPath],{ stdio: ['ignore', 'ignore', 'ignore'], cwd : projectPath });
	cp.on("error", errCallback);
	/*cp.on("close", function(){
		fs.closeSync(outLog);			
		fs.closeSync(errLog);
	});*/
	return cp;
}

function Process(req, res, url, host, port){

	try{
		/*
			if (processCounter > 0){
				setTimeout(function(){
					Process(req, res, url, host, port);
				}, 1000);
				console.log("BUSY: " + processCounter);
				return;
			}*/
		var basePath = Path.resolve("HLAB");
		var projectPath = url.pathname;
		console.log("Processing " + projectPath);
		projectPath = Path.resolve(basePath + "\\STM8" + projectPath);

		if (url.query["action"] == "compile"){
			ProcessCompile(req, res, basePath, projectPath);
			return;
		}
		if (url.query["action"] == "link"){
			ProcessLink(req, res, basePath, projectPath);
			return;
		}
	}		
	catch (err){
		console.log(url);
		console.error(err);
		console.log(err.stack);
		res.statusCode = 500;
		res.end(err + "");
	}
	res.finish(404, "Action not found");
}

function finish(sc, rs){
	this.statusCode = sc;
	this.end(rs);
}

function ClearDir(path){
	fs.readdir(path, function(err, files){
		for (var i = 0; i < files.length; i++){
			fs.unlinkSync(path + "\\" + files[i]);
		}	
	});
}

function ProcessCompile(req, res, basePath, projectPath){
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	console.log("Compiling " + projectPath);
	var stat = fs.statSync(projectPath);
	if (stat.isDirectory()){
		if (!fs.existsSync(projectPath + "\\errors"))
			fs.mkdirSync(projectPath + "\\errors");
		if (!fs.existsSync(projectPath + "\\result"))
			fs.mkdirSync(projectPath + "\\result");
		CompileProject(req, res, basePath, projectPath);
		return;
	}
	if (stat.isFile()){
		var extname = Path.extname(projectPath);
		var dir = Path.dirname(projectPath);
		if (!fs.existsSync(dir + "\\result"))
			fs.mkdirSync(dir + "\\result");
		if (!fs.existsSync(dir + "\\errors"))
			fs.mkdirSync(dir + "\\errors");

		if (extname == ".c"){
			CompileFile(req, res, basePath, projectPath);
			return;
		}
	}		
	res.finish(404, "Element " + projectPath + " is not known element type");
	console.log("Element " + projectPath + " is not known element type");
}

function CompileProject(req, res, basePath, projectPath){
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	var dirName = Path.basename(projectPath);		
	console.log("Compiling project " + dirName);

	ClearDir(projectPath + "\\result");
	ClearDir(projectPath + "\\errors");				
	processCounter++;
	var cmd = COMPILE_CMD.replace(/%1/ig, basePath).replace(/%2/ig,dirName).replace(/%3/ig, projectPath);
	var cp = LaunchProcess(cmd, basePath, dirName, projectPath, function(err){
		console.error(err);		
		console.log(err.stack);
		res.statusCode = 500;
		res.end(err + "");
	});
	var errStr = "";
	var logStr = "";
	/*cp.stderr.on('data', function (data) {
		errStr += data;
	});
	cp.stdout.on('data', function (data) {
		logStr += data;
	});*/
	cp.on('close', function (code) {
		processCounter--;
		var tpl = RespTemplate;
		tpl = tpl.replace("{ERRCODE}", code);
		tpl = tpl.replace("{ERROUT}", errStr);
		tpl = tpl.replace("{STDOUT}", logStr);
		fs.readdir(projectPath, function(err, files){
			try{
				if (err){
					res.finish(500, "readdir " + dirName + " error " + err);
					console.log("readdir " + dirName + " error " + err);
					return;
				}
				var objFiles = [];
				var lsFiles = [];
				var errFiles = [];
				for (var i = 0; i < files.length; i++){
					var extname = Path.extname(files[i]);
					if (extname == ".o"){
						objFiles.push("result/" + files[i]);
						fs.rename(projectPath + "\\" + files[i], projectPath + "\\result\\" + files[i], null);
					}
					if (extname == ".ls"){
						lsFiles.push("result/" + files[i]);
						fs.rename(projectPath + "\\" + files[i], projectPath + "\\result\\" + files[i], null);
					}
					if (extname == ".err"){
						errFiles.push("errors/" + files[i]);
						fs.rename(projectPath + "\\" + files[i], projectPath + "\\errors\\" + files[i], null);
					}
				}
				console.log('Exec code: ' + code);
				tpl = tpl.replace("{OBJFILES}", objFiles);
				tpl = tpl.replace("{LISTFILES}", lsFiles);
				tpl = tpl.replace("{ERRORFILES}", errFiles);
				res.finish(200, tpl); 
			}
			catch (err){
				console.error(err);		
				console.log(err.stack);
				res.statusCode = 500;
				res.end(err + "");
			}
		});
	});
}


function CompileFile(req, res, basePath, projectPath){
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	var fileName = Path.basename(projectPath, ".c");	
	var file = projectPath;
	projectPath = Path.dirname(projectPath);
	console.log("Compiling file " + fileName + ".c");
	processCounter++;	 
	var cmd = COMPILE_FILE_CMD.replace(/%1/ig, basePath).replace(/%2/ig, fileName + ".c").replace(/%3/ig, projectPath);
	var cp = LaunchProcess(cmd, basePath, fileName + ".c", projectPath, function(err){
		console.error(err);		
		console.log(err.stack);
		res.statusCode = 500;
		res.end(err + "");
	});
	var errStr = "";
	var logStr = "";
	/*cp.stderr.on('data', function (data) {
		errStr += data;
	});
	cp.stdout.on('data', function (data) {
		logStr += data;
	});*/
	cp.on('close', function (code) {
		try{				
			console.log('Exec code: ' + code);
			processCounter--;
			var tpl = RespTemplate;
			tpl = tpl.replace("{ERRCODE}", code);
			tpl = tpl.replace("{STDOUT}", logStr);
			console.log(projectPath + "\\" + fileName + ".err");
			if (fs.existsSync(projectPath + "\\" + fileName + ".err")){
				tpl = tpl.replace("{ERRORFILES}", "errors\\" + fileName + ".err");
				tpl = tpl.replace("{ERROUT}",  fs.readFileSync(projectPath + "\\" + fileName + ".err") + "");
				fs.rename(projectPath + "\\" + fileName + ".err", projectPath + "\\errors\\" + fileName + ".err", null);
			}
			else{
				tpl = tpl.replace("{ERRORFILES}", "");
				tpl = tpl.replace("{ERROUT}", errStr);
			}			
			if (fs.existsSync(projectPath + "\\" + fileName + ".ls")){
				tpl = tpl.replace("{LISTFILES}", "result\\" + fileName + ".ls");
				fs.rename(projectPath + "\\" + fileName + ".ls", projectPath + "\\result\\" + fileName + ".ls", null);
			}
			else{
				tpl = tpl.replace("{LISTFILES}", "");
			}
			if (fs.existsSync(projectPath + "\\" + fileName + ".o")){
				tpl = tpl.replace("{OBJFILES}", "result\\" + fileName + ".o");
				fs.rename(projectPath + "\\" + fileName + ".o", projectPath + "\\result\\" + fileName + ".o", null);
			}
			else{
				tpl = tpl.replace("{OBJFILES}", "");
			}					
			res.finish(200, tpl); 
		}
		catch (err){
			console.error(err);			
			console.log(err.stack);
			res.statusCode = 500;
			res.end(err + "");
		}
	});	

	if (fs.existsSync(projectPath + "\\errors\\" + fileName + ".err"))
		fs.unlinkSync(projectPath + "\\errors\\" + fileName + ".err");	
	if (fs.existsSync(projectPath + "\\result\\" + fileName + ".ls"))
		fs.unlinkSync(projectPath + "\\result\\" + fileName + ".ls");
	if (fs.existsSync(projectPath + "\\result\\" + fileName + ".o"))
		fs.unlinkSync(projectPath + "\\result\\" + fileName + ".o");
}


function ProcessLink(req, res, basePath, projectPath){
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	var dirName = Path.basename(projectPath);		
	console.log("Linking " + dirName);

	if (!fs.existsSync(projectPath + "\\errors"))
		fs.mkdirSync(projectPath + "\\errors");
	if (!fs.existsSync(projectPath + "\\result"))
		fs.mkdirSync(projectPath + "\\result");

	fs.readdir(projectPath + "\\", function(err, files){
		processCounter++;
		try{
			if (err){
				res.finish(500, "readdir " + dirName + " error " + err);
				console.log("readdir " + dirName + " error " + err);
				return;
			}
			var lkf = "";
			for (var i = 0; i < files.length; i++){
				if (Path.extname(files[i]) == ".c" && files[i] != "interrupt_vectors.c"){
					lkf += "result\\" + Path.basename(files[i], ".c") + ".o\n";
				}
			}				
			lkf = Template.replace("{OBJECTFILES}", lkf + "");
			fs.writeFileSync(projectPath + "\\" + dirName + ".lkf", lkf);

			var cmd = LINK_CMD.replace(/%1/ig, basePath).replace(/%2/ig, dirName).replace(/%3/ig, projectPath);
			var cp = LaunchProcess(cmd, basePath, dirName, projectPath, function(err){
				console.error(err);				
				console.log(err.stack);
				res.statusCode = 500;
				res.end(err + "");
			});
			var errStr = "";
			var logStr = "";
			/*cp.stderr.on('data', function (data) {
					errStr += data;
				});
				cp.stdout.on('data', function (data) {
					logStr += data;
				});*/
			cp.on('close', function (code) {
				processCounter--;
				console.log('Exec code: ' + code);
				var tpl = RespTemplate;
				tpl = tpl.replace("{ERRCODE}", code);
				tpl = tpl.replace("{STDOUT}", logStr);
				var fname = "result\\" + dirName;
				if (fs.existsSync(projectPath + "\\" + fname +  ".s19")){						
					tpl = tpl.replace("{OBJFILES}", fname + ".s19," + fname + ".sm8," + fname + ".elf");
				}
				else{
					tpl = tpl.replace("{OBJFILES}", "");
				}
				if (fs.existsSync(projectPath + "\\" + fname +  ".map")){
					tpl = tpl.replace("{LISTFILES}", fname + ".map");
				}
				else{
					tpl = tpl.replace("{LISTFILES}", "");
				}
				if (fs.existsSync(projectPath + "\\errors\\" + dirName + ".merr")){
					tpl = tpl.replace("{ERRORFILES}","errors\\" + dirName + ".merr");
					tpl = tpl.replace("{ERROUT}",  fs.readFileSync(projectPath + "\\errors\\" + dirName + ".merr") + "");
				}
				else{
					tpl = tpl.replace("{ERRORFILES}", "");
					tpl = tpl.replace("{ERROUT}", errStr);
				}			
				res.finish(200, tpl); 			
			});
		}
		catch (err){
			console.error(err);			
			console.log(err.stack);
			res.statusCode = 500;
			res.end(err + "");
			processCounter--;
		}						
	});

	if (fs.existsSync(projectPath + "\\errors\\" + dirName + ".merr"))
		fs.unlinkSync(projectPath + "\\errors\\" + dirName + ".merr");	
	if (fs.existsSync(projectPath + "\\result\\" + dirName + ".map"))
		fs.unlinkSync(projectPath + "\\result\\" + dirName + ".map");
	if (fs.existsSync(projectPath + "\\result\\" + dirName + ".sm8"))
		fs.unlinkSync(projectPath + "\\result\\" + dirName + ".sm8");
	if (fs.existsSync(projectPath + "\\result\\" + dirName + ".s19"))
		fs.unlinkSync(projectPath + "\\result\\" + dirName + ".s19");		
	if (fs.existsSync(projectPath + "\\result\\" + dirName + ".elf"))
		fs.unlinkSync(projectPath + "\\result\\" + dirName + ".elf");
}



CreateServer(process.argv[2]);
