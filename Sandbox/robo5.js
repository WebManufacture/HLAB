function RoboController5(robo){
	this.robo = robo;	
	robo.setText("d");
	this.onInterval = function(){
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

				пример- выводит на себя поступившее сообщение

				if (robo.CheckMessages()){
				robo.setText(robo.GetNewMessage().message)
				}

				пример - если рядом кто-то есть послать ему предупреждение )

				if (!robo.isFree()){
				robo.SendMessage("!");
				}

				*/
		 		if (robo.Radar.right == "bug") {
					robo.goLeft();
				} else {
					robo.goRight();
				}
	}
}

RoboController5.prototype = {
	
}

new RoboController5(this);