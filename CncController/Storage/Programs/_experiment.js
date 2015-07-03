var command = function(command, x, y, z, speed, paramA, paramB){
	return {
		command: command, 
		x: x,
		y: y,
		z: z,
		speed: speed,
		paramA: paramA, 
		paramB : paramB 
	};
};

CNC.Command(command(5, 0, 5000, 0, 4000));