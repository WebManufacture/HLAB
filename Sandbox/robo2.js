function RoboController2(robo){
	
	this.robo = robo;
	var memory = 0;
	var go = 0;

	//robo.setText("V");	
	
	this.onInterval = function(){
		
	//robo.setText("V");			
		
		if(memory <= 0){
		
				if(robo.Sensor.right == false) robo.goRight();
				if(robo.Sensor.rightValue < 0) robo.goUp();
				if(robo.Sensor.rightValue > 0) robo.goDown();

				if(robo.Sensor.right = true && robo.Sensor.top == true){
					robo.goDown();
					go = 1;
					memory = Math.abs(robo.Sensor.rigtValue) + 65;
				}
				if(robo.Sensor.right = true && robo.Sensor.bottom == true){
					robo.goDown();
					go = 1;
					memory = Math.abs(robo.Sensor.rigtValue) + 65;
				} 
			
			if(robo.Sensor.right = true){
					robo.goDown();
					go = 1;
					memory = Math.abs(robo.Sensor.rigtValue) + 65;
				}

		}else{
			switch (go)
				{
					case 1:
						robo.goRight();
						if(robo.Sensor.right == false)
						break;
					case 2:
						robo.goUp();
						if(memory >= 1){
							memory--;
						}
						break;
					case 3:
						robo.goUp();
						if(memory >= 1){
							memory--;
						}
						break;
					case 4:
						robo.goLeft();
						if(memory >= 1){
							memory--;
						}
						break;
					default:
						break;
				}
			
		}
	console.log(Math.abs(robo.Sensor.rigtValue));
	console.log("lal = " + go);
		
	/* API
				robo.X - текущая координата Х, только для чтения
				robo.Y - текущая координата Y, только для чтения

				robo.Sensor - означает наличие рядом препятствий
				объект вида {left : null, right: 100, top: 40, bottom : null}
				100 = стена!
				-65 — 65 = другой робот (степень пересечения)

				robo.Radar - информация об объектах (тип)
				объект вида {left : null, right: "wall", top: "bag", bottom : "live"}
				null - нет объекта,
				wall - стена
				bug - системный робот
				live - живой робот (чужой)

				robo.goLeft() //Влево
				robo.goRight() //Вправо
				robo.goUp() //Вверх
				robo.goDown() //Вниз

				robo.isFree() //функция возвращает True если рядом нет ни одного препятствия
				robo.goRandom() //Перемещает робота в случайном направлении.
				robo.goVector(x, y) //Перемещ ет робота в направлении вектора
                  
				______________________
				  
				robo.setText(text) - //Рисует текст на роботе

				robo.GetMessages() - возвращает массив всех сообщений

							
				*/
		
		
		//if(robo.Sensor.rightValue == 100) robo.setText("(-_-)");
		
	}
}

RoboController2.prototype = {
	
}

new RoboController2(this);