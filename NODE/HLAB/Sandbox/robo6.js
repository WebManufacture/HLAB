function RoboController6(robo){
	this.robo = robo;
	
	this.onInterval = function(){
		robo.goRandom();
	}
}

RoboController6.prototype = {
	
}

new RoboController6(this);