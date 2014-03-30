function RoboController8(robo){
	this.robo = robo;
	
	this.onInterval = function(){
		robo.goRandom();
	}
}

RoboController8.prototype = {
	
}

new RoboController8(this);