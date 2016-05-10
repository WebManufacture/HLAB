function RoboController1(robo){
	this.robo = robo;
	var goVector={x : 1,y : 0}
	this.onInterval = function(){
		robo.setText("1");
	
		if (robo.Sensor.rightValue == true || robo.Sensor.leftValue || robo.Sensor.topValue || robo.Sensor.bottomValue){
			goVector = {
						 x : parseInt(1 - Math.random() * 2)+2,
						 y : parseInt(1 - Math.random() * 2)+2
					   }	
		}
		
		robo.goVector(goVector.x, goVector.y);
		
		
		
		
		if(robo.Sensor.rightValue){
			
			
		}
		
		//Tут писать код
		/* API
			robo.X - текущая координата Х, только для чтения
         robo.Y - текущая координата Y, только для чтения
		 
         robo.Sensor - означает наличие рядом препятствий
		 объект вида {left : null, right: 100, top: 40, bottom : null}
		 100 = стена!}
		 -65 -- 65 = другой робот (степень пересечения)
		 
		 robo.Radar  - информация об объектах (тип)
		 объект вида {left : null, right: "wall", top: "bug", bottom : "live"}
		 {leftValue : null, rightValue: 100, topValue: 40, bottomValue : null
		 null - нет объекта,
		 wall - стена
		 bug  - системный робот
		 live - живой робот (чужой)
		 
         robo.goLeft()  //Влево
         robo.goRight() //Вправо
         robo.goUp()   //Вверх
         robo.goDown() //Вниз

         robo.isFree() //функция возвращает True если рядом нет ни одного препятствия
         robo.goRandom() //Перемещает робота в случайном направлении.
         robo.goVector(x, y) //Перемещает робота в направлении вектора

         robo.setText(text) - //Рисует текст на роботе
		*/
	}
		
}

RoboController1.prototype = {
	
}

new RoboController1(this);