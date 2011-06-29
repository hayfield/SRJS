SRJS.Robot = function(){
	
	SRJS.Cube.call( this, 50 );
	
	

};

SRJS.Robot.prototype = new SRJS.Cube();
SRJS.Robot.prototype.constructor = SRJS.Robot;
