/*
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
function RoboController8(robo){
	this.robo = robo;
	var goVector = { x : 1 , y : 0 };
		
	this.onInterval = function(){
		robo.setText(robo.Sensor.rightValue);
		if (!robo.isFree()){
			goVector = {
						 x : parseInt(1 - Math.random() * 2),
						 y : parseInt(1 - Math.random() * 2)
					   }	
			console.info(goVector);
		}
		robo.goVector(goVector.x, goVector.y);
	}
}

RoboController8.prototype = {
	
}

new RoboController8(this);