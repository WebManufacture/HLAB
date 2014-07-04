function RoboController3(robo){
	this.robo = robo;

	this.onInterval = function(){

		if (!robo.isFree()){
			if (robo.Sensor.right){
				if (robo.Sensor.rightValue >= 0){
					robo.goDown();
					robo.setText (robo.Sensor.rightValue);

				}
			} else {
				robo.goRight ();
				robo.setText ("right");
			}
			if (robo.Sensor.right){
				if (robo.Sensor.rightValue < 0){
					robo.goUp();
					robo.setText (robo.Sensor.rightValue);
				} 
			}
			if (robo.Sensor.right && (robo.Sensor.down)){
				robo.goUp();
			}
			if (robo.Sensor.right && robo.Sensor.up){
				robo.goDown();
			}
		} 
		robo.goRight();

		/*if (!robo.isFree()){
			if (robo.Sensor.left) this.mainVector.x = 3;
			if (robo.Sensor.right) this.mainVector.x = -3;
			if (robo.Sensor.top) this.mainVector.y = 3;
			if (robo.Sensor.bottom) this.mainVector.y = -3;*/
	} 
}

RoboController3.prototype = {

}

new RoboController3(this);