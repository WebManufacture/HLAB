function RoboController9(robo){
    this.robo = robo;
    this.mainVector = {x : 1, y : 0};
	
	robo.roadPlan = [{x:10000, y: robo.Y}];
	
	this.onInterval = function(){
/* API
				robo.X - текущая координата Х, только для чтения
				robo.Y - текущая координата Y, только для чтения

				robo.Sensor - означает наличие рядом препятствий, это объект вида:
				{
					left : false, right: true, top: true, bottom : false,
					leftValue : null, rightValue : 100, topValue: 40, bottomValue : null
				}
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
			
		
		var goVector = {};
		
		//robo.roadPlan = [{x:10000, y: robo.Y}];
		
		if (!robo.isFree()) {
			if (robo.Sensor.right) {
				if (robo.Sensor.rightValue > 0) {
					//robo.goDown();
					//robo.roadPlan = [];
					robo.roadPlan.push({x: robo.X, y: robo.Y + 65 - robo.Sensor.rightValue});			
				}
				else{
					//robo.goUp();
					//robo.roadPlan = [];
					robo.roadPlan.push({x: robo.X, y: robo.Y - 65 + robo.Sensor.rightValue});
				}
			}
			if (robo.Sensor.top) {
					robo.roadPlan.push({x: 1000, y:robo.Y});
				if (robo.Sensor.right) {
					robo.roadPlan.push({x: robo.X, y:robo.Y - robo.Sensor.rightValue + 65 });
				}
				
			}
			if (robo.Sensor.bottom) {
				robo.roadPlan.push({x: 1000, y:robo.Y});
				if (robo.Sensor.right) {
					robo.roadPlan.push({x: robo.X, y:robo.Y - robo.Sensor.rightValue - 65 });
				}
			}
		}
		else {
			robo.roadPlan = [];
			robo.roadPlan.push({x: 10000, y: robo.Y})
		}
		
		if (robo.roadPlan[robo.roadPlan.length-1].x > robo.X) {
			goVector.x = 1;
		}
		if (robo.roadPlan[robo.roadPlan.length-1].x < robo.X) {
			goVector.x = -1;
		}
		if (robo.roadPlan[robo.roadPlan.length-1].x == robo.X) {
			goVector.x = 1;
		}
		if (robo.roadPlan[robo.roadPlan.length-1].y > robo.Y) {
			goVector.y = 1
		}
		if (robo.roadPlan[robo.roadPlan.length-1].y < robo.Y) {
			goVector.y = -1
		}
		if (robo.roadPlan[robo.roadPlan.length-1].y == robo.Y) {
			goVector.y = 0
		}		
		robo.setText(robo.Sensor.rightValue);
		robo.goVector( goVector.x, goVector.y );
    }
}

RoboController9.prototype = {

}

new RoboController9(this);