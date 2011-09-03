SRJS.Robot.IO.BumpSensor = function( parentRobot, ID ){
	
	this.robot = parentRobot;
	
	ID = ID || 0;
	this.ID = ID < 0 ? 0 : ID > SRJS.bumpSensorsPerRobot ? SRJS.bumpSensorsPerRobot : ID;
	
	/*
		There are (SRJS.bumpSensorsPerRobot / 4) bump sensors along the edge of each robot.
		They start in the front-left corner and move round clockwise.
		The corners are not covered.
	*/
	this.bumped = function(){
		return false;
	};
	
};

SRJS.Robot.IO.BumpSensor.prototype.__defineGetter__('d',
	function(){
		return this.bumped();
	}
);

SRJS.Robot.IO.BumpSensor.prototype.__defineGetter__('a',
	function(){
		return 0;
	}
);
