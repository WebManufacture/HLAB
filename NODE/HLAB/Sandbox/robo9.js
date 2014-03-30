function RoboController9(robo){
	this.robo = robo;
	
	this.onInterval = function(){
		robo.goRandom();
	}
}

RoboController9.prototype = {
	
}

new RoboController9(this);