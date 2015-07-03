function RoboController10(robo){
	this.robo = robo;
	
	this.onInterval = function(){
		//Tут писать код
		/* API
			robo.X - текущая координата Х, только для чтения
			robo.Y - текущая координата Y, только для чтенияvwe
			robo.Sensor - объект вида {left : false, right: false, top: false, bottom : false} означающий наличие рядом препятствий

			robo.goLeft()  //Влево
			robo.goRight() //Вправо
			robo.goUp()   //Вверх
			robo.goDown() //Вниз

			robo.isFree() //функция возвращает True если рядом нет ни одного препятствия
			robo.goRandom() //Перемещает робота в случайном направлении.
			robo.goVector(x, y) //Перемещ��ет робота в направлении вектора

			robo.setText(text) - //Рисует текст на роботе 


		*/
		robo.goVector(100, 50);
		robo.goDown(100);
		robo.setText(myText);
		var goVector = { x : 1 , y : 0 };
		robo.setText(robo.Sensor.right);
		if (!robo.isFree()){
			if (robo.Sensor.right){
				if (robo.Sensor.rightValue < 64){
					robo.goDown();
				}
				else{
					robo.goUp();
				}
			}
		}
		robo.goVector(goVector.x, goVector.y);
	}
}

RoboController10.prototype = {
	
}

new RoboController10(this);