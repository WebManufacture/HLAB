function RoboController7(robo){
	this.robo = robo;
	sessionStorage.setItem("robo7.text", 1);
	sessionStorage.setItem("robo7.left", 0);
	sessionStorage.setItem("robo7.up", 0);
	sessionStorage.setItem("robo7.down", 0);
	sessionStorage.setItem("robo7.lastMove", 0); // 6 - R, 4 - L, 8 - U, 2 - D
	sessionStorage.setItem("robo7.lastMove2", 0);
	
	this.onInterval = function(){
		
		
		//f = robo.goLeft();
		
		LastM1 = sessionStorage.getItem ("robo7.lastMove");
		LastM2 = sessionStorage.getItem ("robo7.lastMove2");
		
		robo.setText(LastM1);
		
		q = sessionStorage.getItem ("robo7.left");		
		
		if (q>0) {
			
			f = robo.goLeft();
			//robo.setText ('L');
			
			q--;
			sessionStorage.setItem("robo7.left", q);
			
			if (LastM1!=4) {
				sessionStorage.setItem("robo7.lastMove", 4);
				sessionStorage.setItem("robo7.lastMove2", LastM1);
			}
			
		} else {
			q = sessionStorage.getItem ("robo7.up");
			if (q>0) {
				
				f=robo.goUp();
				//robo.setText ('U');
				
				q--;
				sessionStorage.setItem("robo7.up", q);
				
				if (LastM1!=8) {
					sessionStorage.setItem("robo7.lastMove", 8);
					sessionStorage.setItem("robo7.lastMove2", LastM1);
				}
				
			} else {
				
				q = sessionStorage.getItem ("robo7.down");
					
				if (q>0) {
					
					f= robo.goDown();
					//robo.setText ('D');
					
					q--;
					sessionStorage.setItem("robo7.down",q);
					
					if (LastM1!=2) {
						sessionStorage.setItem("robo7.lastMove", 2);
						sessionStorage.setItem("robo7.lastMove2", LastM1);
					}
					
				} else {
					
					if (!robo.Sensor.right) {
						
						f= robo.goRight();
						//robo.setText ('R');
						
						if (LastM1!=6) {
							sessionStorage.setItem("robo7.lastMove", 6);
							sessionStorage.setItem("robo7.lastMove2", LastM1);
						}
						
					} else {
						
						//if (robo.Sensor.rightValue<0) {
							
							if ((robo.Sensor.top)&&(robo.Sensor.bottom)) { 
								
								sessionStorage.setItem("robo7.left", 130);
								sessionStorage.setItem("robo7.up", 65);
								
							} else {
							
								if (robo.Sensor.top){
									/*								
									if (LastM1==6) { 
										f()=robo.goDown();
										//robo.setText ('D');
										
										sessionStorage.setItem("robo7.lastMove", 2);
										sessionStorage.setItem("robo7.lastMove2", 6);
									}	
								
									if (LastM1==8) {
										f()=robo.goDown();
										//robo.setText ('D');
										
										sessionStorage.setItem("robo7.lastMove", 2);
										sessionStorage.setItem("robo7.lastMove2", 8);
									}
								
									if ((LastM1==8)&&(LastM2==2)) {
										sessionStorage.setItem("robo7.left", 130);
										sessionStorage.setItem("robo7.up", 65);
										sessionStorage.setItem("robo7.lastMove", LastM1);
										sessionStorage.setItem("robo7.lastMove2", lastM2);
									}
									*/
									sessionStorage.setItem("robo7.down", 130);
									
									/* if (LastM1!=2) {
										sessionStorage.setItem("robo7.lastMove", 2);
										sessionStorage.setItem("robo7.lastMove2", LastM1);
									}*/
								}
							
								if (robo.Sensor.bottom) {
									LastM1 = sessionStorage.getItem ("robo7.lastMove");
									LastM2 = sessionStorage.getItem ("robo7.lastMove2");
								
									f= robo.goUp();
									//robo.setText ('U');
								
									sessionStorage.setItem("robo7.lastMove", 8);
									sessionStorage.setItem("robo7.lastMove2", LastM1);
								
								}
								
								if ((!robo.Sensor.bottom)&&(!robo.Sensor.top)) {
									f=robo.goUp();
									//robo.setText ('U');
									
									sessionStorage.setItem("robo7.lastMove", 8);
									sessionStorage.setItem("robo7.lastMove2", LastM1);
								}
							}
							
							//f= robo.goDown();
						//}
					}
				}
			}
		}
		f();
	}
 
		
		/*
		if (!robo.Sensor.right) {
			robo.goRight();
			//robo.setText ("R");
		} else {
			if ((robo.Sensor.rightValue>=0)&&(!robo.Sensor.bottom)){
				robo.goDown();
			} else {
				robo.goUp();
			}
		}
			i = sessionStorage.getItem ("robo7.text");
		i++;
		robo.setText (i);
		sessionStorage.setItem("robo7.text", i);
	
	}
	*/
	
}

RoboController7.prototype = {
	
}

new RoboController7(this);