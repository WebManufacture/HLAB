WS.DOMload(function(){
	if (window.OnPageLoaded) window.OnPageLoaded();
	
	var robos = [];
	var roboDivs = DOM.all(".robo");
	
	var roboW = Robo0.offsetWidth;
	var roboH = Robo0.offsetHeight;

	Object.defineProperty(window, "maxX", {
		get:function(){
			return ContentPanel.offsetWidth - roboW;
		}
	});

	Object.defineProperty(window, "maxY", {
		get:function(){
			return ContentPanel.offsetHeight - roboH;
		}
	});
	
	function checkIntersections(roboDiv){
		roboDiv._sense.left = 0;
		roboDiv._sense.right = 0;
		roboDiv._sense.top = 0;
		roboDiv._sense.bottom = 0;
		var hasIntersect = false;
		for (var i = 0; i < roboDivs.length; i++){
			var crobo = roboDivs[i];
			if (crobo != roboDiv){
				if (Math.abs(crobo._x - roboDiv._x) <= roboW && Math.abs(crobo._y - roboDiv._y) <= roboH){
					hasIntersect = true;
					if (Math.abs(crobo._x - roboDiv._x) == roboW){
						if (crobo._x < roboDiv._x){
							roboDiv._sense.left = 65 + crobo._y - roboDiv._y;
						}
						else{
							roboDiv._sense.right = 65 + crobo._y - roboDiv._y;
						}
					}
					if (Math.abs(crobo._y - roboDiv._y) == roboH){
						if (crobo._y < roboDiv._y){
							roboDiv._sense.top = 65 + crobo._x - roboDiv._x;
						}
						else{
							roboDiv._sense.bottom = 65 + crobo._x - roboDiv._x;
						}
					}
				}
			}
		}
		if (roboDiv._x <= 0) {
			roboDiv._sense.left = 64;
			hasIntersect = true;
		}
		if (roboDiv._y <= 0) {
			roboDiv._sense.top = 64;
			hasIntersect = true;
		}
		if (roboDiv._x >= maxX) {
			roboDiv._sense.right = 64;
			hasIntersect = true;
		}
		if (roboDiv._y >= maxY) {
			roboDiv._sense.bottom = 64;
			hasIntersect = true;
		}
		
		if (roboDiv._sense.left) {
			roboDiv.style.borderLeft = "solid 1px red";
		}
		else{
			roboDiv.style.borderLeft = '';
		}
		
		if (roboDiv._sense.right) {
			roboDiv.style.borderRight = "solid 1px red";
		}
		else{
			roboDiv.style.borderRight = '';
		}

		if (roboDiv._sense.top) {
			roboDiv.style.borderTop = "solid 1px red";
		}
		else{
			roboDiv.style.borderTop = '';
		}

		if (roboDiv._sense.bottom) {
			roboDiv.style.borderBottom = "solid 1px red";
		}
		else{
			roboDiv.style.borderBottom = '';
		}


		return hasIntersect;
	}
			
	for (var i = 31; i  < 50; i++){
		var food = ContentPanel.div(".food");
		var x = Math.random() * maxX;
		var y = Math.random() * maxY;
		food.style.left = x + "px";
		food.style.top = y + "px";
	}
		
	function placeRobot(roboDiv){
		setTimeout(function(){
			var x = Math.random() * maxX;
			var y = Math.random() * maxY;
			roboDiv.StartStep();
			roboDiv.SetCoord(x, y);
			if (checkIntersections(roboDiv)){
				placeRobot(roboDiv);
			}
		}, 100);
	}
	var clength = roboDivs.length; 
		
	for (var i = 0; i < clength; i++){
		var roboDiv = roboDivs[i];
		var robo = robos[i] = new Robo(roboDiv);
		roboDiv.textContent = i;
		roboDiv.StartStep();
		//roboDiv.SetCoord(0, roboH * i + 1);
		roboDiv.SetCoord(0, roboH * i + 1);
	};
	
	for (var i = clength; i < 30; i++){
		var roboDiv = ContentPanel.div(".robo.standart");
		var robo = robos[i] = new Robo(roboDiv);
		robo.standart = true;
		roboDiv.textContent = i;
		placeRobot(roboDiv);
	}
	
	roboDivs = DOM.all(".robo");
	
	var intervals = [];
	var controllers = [];
	var scripts = [];
	var wFall = new Async.Waterfall(function WaterfallComplete(){
		scripts.forEach(function(script, index){
			if (script){
				var controller = null;
				try{
					var func = function(robo){
						controllers[index] = eval(script);
					}
					func.call(robos[index], robos[index]);
					if (controllers[index] && typeof(controllers[index]) == 'function'){						
						controllers[index] = new controllers[index](robos[index]);					
					}
				}
				catch(e){
					console.log('Error ' + e);
				}
			}
		});
	});
	for (var i = 0; i < robos.length; i++){
		robos[i].saveState();		
		var src = "Robo" + (i) + ".js";
		if (robos[i].standart) src = "Robo0.js"
		Net.get(src, null, wFall.addClosure(function(result){
			scripts[this.index] = result;
		}, {index : i}));
		/*var iFrame = document.createElement('iframe');
		DOM.add(iFrame);
		var fHead = iFrame.contentDocument.head;
		var script = iFrame.contentDocument.createElement('script');
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", "Robo" + (i + 1) + ".js");
		fHead.appendChild(script);
		frames.push(iFrame);*/
	}
	
	function ProcessTick(){
		for (var i = 0; i < controllers.length; i++){
			var controller = controllers[i];
			if (controller && typeof controller.onInterval == 'function'){
				roboDivs[i].StartStep();
				checkIntersections(roboDivs[i]);
				try{
				controller.onInterval(controller.robo);
				}
				catch(e){
					console.log(e);
				}
			}
		}				
	}	
	
	var timeout = 10;
	
	var interval = null; 
	
	Init = function(){
		if (interval) return;
		for (var i = 0; i < robos.length; i++){
			var robo = robos[i];
			robo.saveState();
		}
	}
	
	Start = function(){					  
		if (interval) return;
		/*for (var i = 0; i < robos.length; i++){
			robos[i].restoreState();
		}*/
		interval = setInterval(ProcessTick, timeout);
	};
	
	Stop = function(){		
		clearInterval(interval);
		interval = null;
	};
	
	Init();
});