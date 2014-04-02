function RoboController3(robo){
	this.robo = robo;
	
	this.onInterval = function(){
		robo.goRight();
		if (robo.Sensor.right == true){
			robo.goDown();
			if (robo.Y > 350){
				robo.goUp();			
				robo.setText("U");
			} else {
				robo.goDown();			
				robo.setText("D");
			}			
	}   
	}
}

RoboController3.prototype = {
	
}

new RoboController3(this);