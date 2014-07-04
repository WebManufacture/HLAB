function RoboController2(robo){
	
	this.robo = robo;
	this.mainVector = {};	
	
	this.onInterval = function(){
		
		
		if (!robo.isFree()){
			if (robo.Sensor.left) this.mainVector.x = 1;
			if (robo.Sensor.right) this.mainVector.x = -1;
			if (robo.Sensor.top) this.mainVector.y = 1;
			if (robo.Sensor.bottom) this.mainVector.y = -1;
		}


		if (robo.Sensor.top){
			robo.goDown();
			robo.setText("D");
 		}
		
		else if (robo.Sensor.right){
			if (robo.X > 450){
				robo.goUp() ;			
				robo.setText("R");
			}
			else{
				robo.goDown();			
				robo.setText("D");
			}			
			
		}
		
		else if (robo.Sensor.bottom){
			robo.goUp() ;			
			robo.setText("U");
		}
		else {
			robo.goRight();			
			robo.setText("R");
		}

		
		
		if (this.mainVector.x = 5) {
			
			robo.goLeft();
		}
		
	
		
		
		
		
		
		
	}
}

RoboController2.prototype = {
	
}

new RoboController2(this);