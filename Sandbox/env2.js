WS.DOMload(function(){
	if (window.OnPageLoaded) window.OnPageLoaded();

	var robos = [];
	var roboDivs = DOM.all(".robo");

	var cicle = 0;
	
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
	
	function createMessageFunc(robo){
		return function(msg){
			if (robo._leftIntersect){
				console.log(cicle + ":" + robo._num + "-->" + robo._leftIntersect._num + ": " + msg);
				robo._leftIntersect._receiveMessage(msg, robo._num, cicle);
			}
			if (robo._rightIntersect){
				console.log(cicle + ":" + robo._num + "-->" + robo._rightIntersect._num + ": " + msg);
				robo._rightIntersect._receiveMessage(msg, robo._num, cicle);
			}
			if (robo._topIntersect){
				console.log(cicle + ":" + robo._num + "-->" + robo._topIntersect._num + ": " + msg);
				robo._topIntersect._receiveMessage(msg, robo._num, cicle);
			}
			if (robo._bottomIntersect){
				console.log(cicle + ":" + robo._num + "-->" + robo._bottomIntersect._num + ": " + msg);
				robo._bottomIntersect._receiveMessage(msg, robo._num, cicle);
			}
		}
	}

	function checkIntersections(roboDiv){
		roboDiv._sense.leftValue = null;
		roboDiv._sense.rightValue = null;
		roboDiv._sense.topValue = null;
		roboDiv._sense.bottomValue = null;
		roboDiv._radar.left = null;
		roboDiv._radar.right = null;
		roboDiv._radar.top = null;
		roboDiv._radar.bottom = null;
		roboDiv._leftIntersect = null;
		roboDiv._rightIntersect = null;
		roboDiv._topIntersect = null;
		roboDiv._bottomIntersect = null;
		var hasIntersect = false;
		for (var i = 0; i < roboDivs.length; i++){
			var crobo = roboDivs[i];
			var rW = (crobo._type == "bug")?(crobo.offsetWidth):roboW;
			var rH = (crobo._type == "bug")?(crobo.offsetHeight):roboH;
			// A - agile mazafucka
			if (crobo != roboDiv){
				if (Math.abs(crobo._x - roboDiv._x) <= rW && Math.abs(crobo._y - roboDiv._y) <= rH){
					hasIntersect = true;
					if (Math.abs(crobo._x - roboDiv._x) == rW){
						if (crobo._x < roboDiv._x){
							roboDiv._sense.leftValue = roboDiv._y - crobo._y;	
							roboDiv._radar.left = crobo._type;
							roboDiv._leftIntersect = crobo;
							//А как отличить реальное отличие на 1 и нереальное ? :)
							/*if (roboDiv._sense.left == 0) {
								roboDiv._sense.left = 1;
							}*/
						}
						else{
							roboDiv._sense.rightValue = roboDiv._y - crobo._y;
							roboDiv._radar.right = crobo._type;
							roboDiv._rightIntersect = crobo;
						}
					}
					if (Math.abs(crobo._y - roboDiv._y) == rH){
						if (crobo._y < roboDiv._y){
							roboDiv._sense.topValue = roboDiv._x - crobo._x;
							roboDiv._radar.top = crobo._type;
							roboDiv._topIntersect = crobo;
						}
						else{
							roboDiv._sense.bottomValue = roboDiv._x - crobo._x; 
							roboDiv._radar.bottom = crobo._type;
							roboDiv._bottomIntersect = crobo;
						}
					}
				}
			}
		}
		if (roboDiv._x <= 0) {
			roboDiv._sense.leftValue = 100;
			roboDiv._radar.left = "wall";
		}
		if (roboDiv._y <= 0) {
			roboDiv._sense.topValue = 100;
			roboDiv._radar.top = "wall";
		}
		if (roboDiv._x >= maxX) {
			roboDiv._sense.rightValue = 100;
			roboDiv._radar.right = "wall";
			Stop();
			alert(roboDiv.get("@num") + " WIN!");
		}
		if (roboDiv._y >= maxY) {
			roboDiv._sense.bottomValue = 100;
			roboDiv._radar.bottom = "wall";
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

	function placeRobot(roboDiv, count){
		setTimeout(function(){
			if (count < 5) count = 5;
			var pos = parseInt(Math.random() * (count));
			roboDiv._setCoordInternal(0, (roboH + 2) * pos);
			if (checkIntersections(roboDiv)){
				placeRobot(roboDiv, count);
			}
		}, 100);
	}
	
	function placeFake(roboDiv){
		setTimeout(function(){
			var x = Math.random() * maxX;
			var y = Math.random() * maxY;
			roboDiv._setCoordInternal(x, y);
			if (checkIntersections(roboDiv) || x < 50){
				placeFake(roboDiv);
			}
		}, 100);
	}
	
	var clength = roboDivs.length; 

	for (var i = 0; i < clength; i++){
		var roboDiv = roboDivs[i];
		roboDiv._num = roboDiv.get("@num");
		var robo = robos[i] = new Robo(roboDiv);
		roboDiv._sendMessage = createMessageFunc(roboDiv, robo)
		roboDiv._type = "live"
		robo._type = "live";
		roboDiv.textContent = roboDiv._num;
		//roboDiv.SetCoord(0, roboH * i + 1);
		placeRobot(roboDiv, clength)
	};

	for (var i = clength; i < 30; i++){
		var roboDiv = ContentPanel.div(".robo.standart");
		roboDiv._num = i;
		var robo = robos[i] = new Robo(roboDiv);
		robo.standart = true;
		roboDiv._type = "bug"
		robo._type = "bug"
		roboDiv.textContent = i;
		placeFake(roboDiv);
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
		var src = "Robo" + robos[i].Num + ".js";
		if (robos[i].standart) src = "Robo0.js"
		Net.get(src, null, wFall.addClosure(function(result){
			scripts[this.index] = result;
		}, {index: i}));
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
		cicle++;
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
				roboDivs[i].FinishStep();
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
		cicle = 0;
		interval = setInterval(ProcessTick, timeout);
	};

	Stop = function(){		
		clearInterval(interval);
		interval = null;
	};

	
	
//Цвет роботов	
function getRandomColor(){
var colorLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
var colorNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var randomColor = "#";

for (var i = 0; i < 6; i++){
var randomNumber = Math.round( Math.random() * 100);
	if( randomNumber < 50 ){
		randomColor += colorLetters[ Math.round( randomNumber / 20 )];
		
	}
	else{
		randomColor += colorNumbers[ Math.round(  randomNumber / 11 )];
	}
}
return randomColor;
}	
	
for (var i = 0; i < clength; i++){
	roboDivs[i].style.background = getRandomColor();
}
	
	
	
	
	
	
	Init();
});





