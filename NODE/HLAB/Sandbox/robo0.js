function RoboController0(robo){
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

RoboController0.prototype = {
	
}

new RoboController0(this);