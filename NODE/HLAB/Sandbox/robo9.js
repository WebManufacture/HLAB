function RoboController9(robo){
	this.robo = robo;
	this.mainVector = {x : 1, y : 0};
	this.onInterval = function(){
		if (!robo.isFree()){
			if (robo.Sensor.left) this.mainVector.x = 3;
			if (robo.Sensor.right) this.mainVector.x = -1;
			if (robo.Sensor.top) this.mainVector.y = -1;
			if (robo.Sensor.bottom) this.mainVector.y = -1;
			//robo.setText(this.mainVector.x + "" + this.mainVector.y);			
		}
		var x = Math.round(this.mainVector.x - Math.random() * 5);
		var y = Math.round(this.mainVector.y - Math.random() * 5);
		robo.goVector(x, y);
	}
}

RoboController9.prototype = {
	
}

new RoboController9(this);