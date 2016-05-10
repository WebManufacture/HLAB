function RoboController10(robo, ttt, rrr, eee){
	this.robo = robo;
	
	//Тут переменные инициализации
	
	this.onInterval = function(){
//Tут писать код
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

				robo.setText(text) - //Рисует текст на роботе

				MESSAGING!

				robo.SendMessage("ваше сообщение") - отправить сообщение всем роботам с которыми вы пересекаетесь )
				robo.CheckMessages() - проверить, не поступало ли вам сообщений

				robo.GetNewMessage() - взять первое новое сообщение из поступивших
				Возвращает вот такой объект.
				{
				message : "текст сообщения",
				from : номер пославшего,
				date : дата,
				cicle : цикл от начала матча,
				readed : было ли уже прочитано
				}


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