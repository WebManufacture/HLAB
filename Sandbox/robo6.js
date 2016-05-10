function RoboController6(robo){
	this.robo = robo;
	robo.setText("F");
	var moveDir = {x:1,y:0};
	var lastMoveDir = {x:0,y:0};
	var needChangeDir = true;
	GoVector(1,0);
	
	this.onInterval = function(){
		/* API
         robo.X - текущая координата Х, только для чтения
         robo.Y - текущая координата Y, только для чтения
		 
         robo.Sensor - означает наличие рядом препятствий
		 объект вида {leftValue : null, rightValue: 100, topValue: 40, bottomValue : null}
		 100 = стена!
		 -65 -- 65 = другой робот (степень пересечения)
		 
		 robo.Radar  - информация об объектах (тип)
		 объект вида {left : null, right: "wall", top: "bag", bottom : "live"}
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
         robo.goVector(x, y) //Перемещ��ет робота в направлении вектора

         robo.setText(text) - //Рисует текст на роботе


         */
		// Сюда влез Fenrir и чето начудит тут)
		
		if(!robo.isFree())
		{
			if(robo.Sensor.rightValue == null)
			{
				GoVector(1,0);
			}
			else
			{
				TestMoveDir();
				MoveMinDistExit();
			}
		}
		else
		{
			GoVector(moveDir.x,moveDir.y);
		}
		
		
		//robo.goRandom(); // Fenrir 22.08.15
	}
	function TestMoveDir()
	{
		if(
			(moveDir.x < 0 && robo.Sensor.leftValue != null) ||
			(moveDir.y < 0 && robo.Sensor.bottomValue != null) ||
			(moveDir.y > 0 && robo.Sensor.topValue != null) ||
			(moveDir.x > 0 && robo.Sensor.rightValue != null)
		)
			needChangeDir = true;
		console.log("Test " + needChangeDir +" moveDir x="+ moveDir.x + " y="+moveDir.y);
	}
	function MoveMinDistExit()
	{
		/*console.log("sensor");
		console.log("bot " + robo.Sensor.bottomValue);
		console.log("top " + robo.Sensor.topValue);
		console.log("left " + robo.Sensor.leftValue);
		console.log("right " + robo.Sensor.rightValue);
		console.log(needChangeDir);*/
		if(!needChangeDir)
		{
			GoVector(moveDir.x,moveDir.y);
			return;
		}
		if(robo.Sensor.topValue == null && !CompareNewAndLast(0,1))
		{
			console.log("i try go top");
			GoVector(0,1);
			return;
		}
		else if(robo.Sensor.bottomValue == null && !CompareNewAndLast(0,-1))
		{
			console.log("i try go bottom");
			GoVector(0,-1);
			return;
		}
		else if(robo.Sensor.leftValue == null && !CompareNewAndLast(-1,0))
		{
			console.log("i try go left");
			GoVector(-1,0);
			return;
		}
	}
	
	function CompareNewAndLast(x,y)
	{
		if(lastMoveDir.x == x && lastMoveDir.y == y)
		{
			console.log("compare true");
			return true;
		}
		console.log("compare false");
		return false;
	}
	
	function GoVector(x,y)
	{
		needChangeDir = false;
		if(moveDir.x !=x || moveDir.y !=y)
		{
			console.log(lastMoveDir);
			lastMoveDir.x = moveDir.x;
			lastMoveDir.y = moveDir.y;
		}
		moveDir.x = x;
		moveDir.y = y;
		robo.goVector(x, -y);
	}
	
	function SortFunc(a,b)
	{
		if(Math.abs(a)<Math.abs(b))
		{
			return -1;
		}
		if(Math.abs(b)>Math.abs(a))
		{
			return 1;
		}
		return 0;
	}
}

RoboController6.prototype = {
	
}

new RoboController6(this);