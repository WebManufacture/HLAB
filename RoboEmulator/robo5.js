function RoboController5(robo){
	this.robo = robo;	
	robo.roadPlan = [{x:10000, y: robo.Y}];
	
	this.onInterval = function(){
		
		var goVector = {};
		
		//robo.roadPlan = [{x:10000, y: robo.Y}];
		
		if (!robo.isFree()) {
			if (robo.Sensor.right) {
				if (robo.Sensor.rightValue > 0) {
					//robo.goDown();
					//robo.roadPlan = [];
					robo.roadPlan.push({x: robo.X, y: robo.Y + 65 - robo.Sensor.rightValue});			
				}
				else{
					//robo.goUp();
					//robo.roadPlan = [];
					robo.roadPlan.push({x: robo.X, y: robo.Y - 65 + robo.Sensor.rightValue});
				}
			}
			if (robo.Sensor.top) {
					robo.roadPlan.push({x: 1000, y:robo.Y});
				if (robo.Sensor.right) {
					robo.roadPlan.push({x: robo.X, y:robo.Y - robo.Sensor.rightValue + 65 });
				}
				
			}
			if (robo.Sensor.bottom) {
				robo.roadPlan.push({x: 1000, y:robo.Y});
				if (robo.Sensor.right) {
					robo.roadPlan.push({x: robo.X, y:robo.Y - robo.Sensor.rightValue - 65 });
				}
			}
		}
		else {
			robo.roadPlan = [];
			robo.roadPlan.push({x: 10000, y: robo.Y})
		}
		
		if (robo.roadPlan[robo.roadPlan.length-1].x > robo.X) {
			goVector.x = 1;
		}
		if (robo.roadPlan[robo.roadPlan.length-1].x < robo.X) {
			goVector.x = -1;
		}
		if (robo.roadPlan[robo.roadPlan.length-1].x == robo.X) {
			goVector.x = 0;
		}
		if (robo.roadPlan[robo.roadPlan.length-1].y > robo.Y) {
			goVector.y = 1
		}
		if (robo.roadPlan[robo.roadPlan.length-1].y < robo.Y) {
			goVector.y = -1
		}
		if (robo.roadPlan[robo.roadPlan.length-1].y == robo.Y) {
			goVector.y = 0
		}		
		robo.setText(robo.Sensor.rightValue);
		robo.goVector( goVector.x, goVector.y );				
		
	}
}

RoboController5.prototype = {
	
}

new RoboController5(this);