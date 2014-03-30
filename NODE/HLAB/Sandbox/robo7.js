function RoboController7(robo){
	this.robo = robo;
	
	this.onInterval = function(){
		robo.goRandom();
	}
}

RoboController7.prototype = {
	
}

new RoboController7(this);