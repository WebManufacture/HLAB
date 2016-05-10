function RoboController0(robo){
	this.robo = robo;
		
	this.onInterval = function(){
		if (robo.CheckMessages()){
			robo.setText(robo.GetNewMessage().message)
		}
	}	
}

RoboController0.prototype = {
	
}

new RoboController0(this);