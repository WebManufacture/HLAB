function RoboController3(robo){
	this.robo = robo;
	robo.setText('3');
	
	/*var flag = 0;
	
	// Object Map
	var Map = function(x, y, direction){
    this.x = x;
    this.y = y;
    this.direction = direction;
	};

	Map.prototype = {
		coordinates: [],

		mapPath: [],

		setCoordinates: function(x, y, direction){
			this.coordinates.push(new Map(x, y, direction));
		},

		setPath: function(x, y, direction){
			this.setCoordinates(x, y, direction);

			if(this.coordinates.length > 1){
				var length = this.coordinates.length;

				if( this.coordinates[length - 2].x < this.coordinates[length - 1].x ){
					this.mapPath.push(new Map(1, 0, direction));
				}
			}
		},

		comeBack: function(){
			this.mapPath.splice(this.mapPath.length - 1, 1);
			var obj = this.mapPath[this.mapPath.length - 1];
			robo.goVector(-obj.x, -obj.y);
		}
	};
	// Cansel object Map
	
	var map = new Map();
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

				
		.*/
	
	
	this.mainVector = {x : 1, y : 0};
	
	this.onInterval = function(){
		/*
		
		switch(flag){
			case -1: map.comeBack(); break;
			case 0: if(robo.Sensor.right) flag = -1;
					else{
						map.setPath(robo.X, robo.Y, 'right');
						console.log(map.mapPath[map.mapPath.length - 1]);
						robo.goRight(); break;
					}
		}
		
		robo.goRight();
		if(robo.Sensor.rightValue <= 0) robo.goUp();
		if(robo.Sensor.rightValue >= 0 | robo.Sensor.rightValue == 0) robo.goDown();
		robo.setText(robo.Sensor.rightValue);
		
	 */
		
		
		
		if(robo.Sensor.rightValue === null) robo.goRight();
				
		if(robo.Sensor.topValue === null && robo.Sensor.rightValue <= 0) robo.goUp();
																	
		if(robo.Sensor.topValue !== null || robo.Sensor.bottomValue === null) robo.goDown();
																			   
		if(!(robo.Sensor.bottomValue === null)) robo.goLeft();
		if(!(robo.Sensor.topValue === null)) robo.goVector(-1, -1);	
		};
	
}

RoboController3.prototype = {

}

new RoboController3(this);