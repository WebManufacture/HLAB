window.a = 1;
var a;
a;
window;
window.ttt = {};
window.ttt.a = 10;
window.ttt.b = 10123;
window.ttt.qqq = {};
window.ttt.qqq.a = 123023;


c 1. 123.3  132 13e-1 -1212 .82818 0x2F  
c 2. "kjandkjswdvkjwbnvkj" 'acqfqwq23\'\n\0x6373 4214323423' "akjsdbbde7'qwdqwd" "" 
c 3. true, false
     var a = true;
     var b = false;
     var a = 1 > 2;
	 var v = (a != b) || (true == 1);  //;

    var a = 235;

	if (a){
		
	}
	else{
		
	}
     
c 4. null, undefined
l 5. {};  new Object();

    qqq = { 
		myName : "Sa",
		myRole : "Admin", 
		"(*#@)QKNWDKJHQBWDJG!@*&YT!&@#G" : 23234234
	};

	qqq.myName = "Sa";
	qqq.myRole = "Admin";
    qqq["myCustom"] = 123423423;
	qqq["(*#@)QKNWDKJHQBWDJG!@*&YT!&@#G"] = 23234234234;
	qqq["0"]["2342"] = 11123;
	qqq["1"] = 123123;
	qqq['2'] = 234234234;
    ttt.name = qqq.myName;
	ttt.num = qqq["(*#@)QKNWDKJHQBWDJG!@*&YT!&@#G"];

    

c\l 6. 
	window.adadda = function();
	
	window.adadda = function(){
		window.alert("~");
	}
	
	function adadda(); function adadda(){};
    
	window.ttt.maxNum = function(){
		var k = 0;
		for (var i = 0; i < arguments.length; i++){
			if (arguments[i] > k) k = arguments[i];	
		}			
		return k;
	};

	var k = 1 + window.ttt.max(1,2,"2332434"); 
	var k = 1 + window.ttt.max(1); 

l 7. [];
	yyy = [];
    yyy[0] = 11212;
    yyy[1] = 121432131;
    yyy[2] = 9321341234;
    yyy.push(84323423);
    for (var i = 0; i < yyy.length; i++){
		alert(yyy[i]);
	}

    window.a = 1;

;

function RoboController10(robo, ttt, rrr, eee){
	this.robo = robo;
	this.mainVector = {x : 1, y : 1};
	
	this.onInterval = function(){
		//Tут писать код
		/* API
			robo.X - текущая координата Х, только для чтения
			robo.Y - текущая координата Y, только для чтения
			robo.Sensor - объект вида {left : false, right: false, top: false, bottom : false} означающий наличие рядом препятствий
			
			robo.goLeft()  //Влево
			robo.goRight() //Вправо
			robo.goUp()   //Вверх
			robo.goDown() //Вниз
			
			robo.isFree() //функция возвращает True если рядом нет ни одного препятствия
			robo.goRandom() //Перемещает робота в случайном направлении.
			robo.goVector(x, y) //Перемещает робота в направлении вектора
			
			robo.setText(text) - //Рисует текст на роботе 
			
		
		*/
		if (!robo.isFree()){
			if (robo.Sensor.left) this.mainVector.x = 3;
			if (robo.Sensor.right) this.mainVector.x = -3;
			if (robo.Sensor.top) this.mainVector.y = 3;
			if (robo.Sensor.bottom) this.mainVector.y = -3;
			//robo.setText(this.mainVector.x + "" + this.mainVector.y);			
		}
		var x = this.mainVector.x - Math.random() * 4;
		var y = this.mainVector.y - Math.random() * 4;
		robo.goVector(x, y);
	}
}

RoboController10.prototype = {
	
}

new RoboController10(this);


/*

function RoboController4(robo){
	this.robo = robo;

	robo.setText("В");
 
	this.mainVector = {};
	
	this.onInterval = function(){
		//robo.goRight();

		if (!robo.isFree()){
			if (robo.Sensor.left) this.mainVector.x = 3;
			if (robo.Sensor.right) this.mainVector.x = -3;
			if (robo.Sensor.top) this.mainVector.y = 3;
			if (robo.Sensor.bottom) this.mainVector.y = -3;
			//robo.setText(this.mainVector.x + "" + this.mainVector.y);			
		}


		if (robo.Sensor.top){
			robo.goDown();
			robo.setText("V");
 		}
		else if (robo.Sensor.right){
			if (robo.X > 450){
				robo.goUp();			
				robo.setText("^");
			}
			else{
				robo.goDown();			
				robo.setText("V");
			}			
			
		}
		else if (robo.Sensor.bottom){
			robo.goUp();			
			robo.setText("^");
		}
		else {
			robo.goRight();			
			robo.setText(">");
		}

	}	
}

RoboController4.prototype = {

}

new RoboController4(this);

*/