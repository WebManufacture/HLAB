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


		if (robo.Sensor.top == true){
			robo.goDown();
			robo.setText("↓");
 		}
		else if (robo.Sensor.right == true){
			if (robo.X > 450){
				robo.goUp() ;			
				robo.setText("→");
			}
			else{
				robo.goDown();			
				robo.setText("↓");
			}			
			
		}
		else if (robo.Sensor.bottom == true){
			robo.goUp() ;			
			robo.setText("↑");
		}
		else {
			robo.goRight();			
			robo.setText("→");
		}
/*
8592 — ←
8593 — ↑
8594 — →
8595 — ↓
		
		//robo.goVector(x, y)



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



	}	
}

RoboController4.prototype = {

}

new RoboController4(this);