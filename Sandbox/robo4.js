function RoboController4(robo){
	
	this.robo = robo;
	
	var direction = {
		x : 1,
		y : 0
	};
	
	var action = {
		direct : direction,
		count : 0
	};
	
	var actionQueue = [action];
	
	
	this.onInterval = function(){
		robo.setText("E");
		var left  = robo.Sensor.left;
		var right  = robo.Sensor.right;
		var top  = robo.Sensor.top;
		var bottom  = robo.Sensor.bottom;
		var x = direction.x;
		var y = direction.y;
		
		/**
		 *	Coordinates of direction
		 *	
		 *		    (0, 1)
		 *
		 *	(-1,0)			(1,0)
		 *
		 *			(0,-1)
		 *
		 *
		 *	why bottom isn't (0, -1) ??? 
		 */
		

		if ((x ==  1 && y ==  0 && right  != 0) ||
		   	(x == -1 && y ==  0 && left   != 0) ||
			(x ==  0 && y ==  1 && bottom != 0) ||
			(x ==  0 && y == -1 && top    != 0) ||
		   	(x ==  1 && y ==  1 && ((right != 0) || (bottom != 0))) ||
		   	(x ==  1 && y == -1 && ((right != 0) || (top    != 0))) ||
		   	(x == -1 && y ==  1 && ((left  != 0) || (bottom != 0))) ||
			(x == -1 && y == -1 && ((left  != 0) || (top    != 0))) ||
			(x ==  0 && y ==  0))
		{		
			direction = {
				x : parseInt(1 - Math.random() * 4) + 1,
				y : parseInt(1 - Math.random() * 4) + 1	
			}
			
			action = {
				direct : direction,
				count : 0
			};
			
			actionQueue.push(action);
	
			console.log("direction ==> x: " + direction.x + " y: " + direction.y);		
			
			var tmpActionQueue = actionQueue[action.length - 1];
			var tmpDirect = tmpActionQueue.direct;											// wtf?? Error msq ==> TypeError: Cannot 
			var tmpCount = tmpActionQueue.count;											// read property 'direct' of undefined.
			
			console.log("actionQueue ==> direct: x == " + tmpDirect.x + " y == " + 
						tmpDirect.y + " count: " + tmpCount);
		}
		
		robo.goVector(direction.x, direction.y);
		
		actionQueue.count = actionQueue.count + 1; 
		
		/*
		
		// алгорит робота не лоха. 
		// но не без изъян
		
		if (right == 0){
			robo.goRight();			
		}else{
			if (bottom == 0){
				robo.goDown();
			}else{
				if (top == 0){
					robo.goUp();
				}else{
					if (right == 0){
						robo.goRight();
					}	
				}
			}
		}
		
		*/
		
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