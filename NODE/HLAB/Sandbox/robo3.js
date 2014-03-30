function RoboController3(robo){
	this.robo = robo;
	
	this.onInterval = function(){
		robo.goRight();
	}
}

RoboController3.prototype = {
	
}

new RoboController3(this);