SRJS.Robot.RangeFinder = function( parentRobot, ID ){
	
	this.robot = parentRobot;
	
	ID = ID || 0;
	this.ID = ID < 0 ? 0 : ID > SRJS.rangeFindersPerRobot ? SRJS.rangeFindersPerRobot : ID;
	
	SRJS.phys.addRangeFinder( this );
	
};
