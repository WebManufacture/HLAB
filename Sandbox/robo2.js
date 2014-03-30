function RoboController2(robo){
	this.robo = robo;
	
	this.onInterval = function(){
		robo.goRandom();
	}
}

RoboController2.prototype = {
	
}

new RoboController2(this);