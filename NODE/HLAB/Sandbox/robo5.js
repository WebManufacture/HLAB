function RoboController5(robo){
	this.robo = robo;
	this.robo.state = {up: 0, down:0};
	
	this.onInterval = function(){
		
		//var goVector = {};
			
				
		//robo.setText(robo.Sensor.right);
		/*function state() {
  			var value = 0;
     
 			return {
   				up: function() { 
    				return value = 1;
    			},
  
    			down: function() { 
      				return value = -1;
    			},
 
    			reset: function() {
      				return value = 0;
    			}
  			};
		}
 
		var set = state();*/
				
		if (!robo.isFree()){
			if (robo.Sensor.right){
				if (robo.Sensor.right < 64 && robo.state.up == 0 && robo.state.down == 0){
					robo.goDown();
					if (robo.Sensor.bottom){
						robo.state.down = 1;
					}
				}
				if (robo.Sensor.right > 64 && robo.state.up == 0 && robo.state.down == 0){
					robo.goUp();
					if (robo.Sensor.top){
						robo.state.up = 1;
					}
				}
				if (robo.state.up == 1){
					robo.goDown();
				}
				if (robo.state.down == 1){
					robo.goUp();
				}
				if (robo.state.up == 1 && robo.state.down == 1){
					robo.goLeft();
				}
					
			}
			else {
				robo.goRight();
				robo.state.up = 0;
				robo.state.down = 0;
			}
		}
		robo.setText(robo.state.up + robo.state.down)
		//robo.goVector(goVector.x, goVector.y);
	}
}

RoboController5.prototype = {
	
}

new RoboController5(this);