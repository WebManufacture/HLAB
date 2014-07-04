function RoboController8(robo){
	this.robo = robo;
	
	this.onInterval = function(){
		var goVector = { x : 1 , y : 0 };
		robo.setText(robo.Sensor.right);
		if (!robo.isFree()){
			if (robo.Sensor.right){
				if (robo.Sensor.rightValue < 64){
					robo.goDown();
				}
				else{
					robo.goUp();
				}
			}
		}
		robo.goVector(goVector.x, goVector.y);
	}
}

RoboController8.prototype = {
	
}

new RoboController8(this);