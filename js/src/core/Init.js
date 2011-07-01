SRJS.Init = function(){

	var bob = new SRJS.Arena2011();
	SRJS.CURRENT_ARENA.addRobot();
	var robby = new SRJS.Robot();
	robby.motor[0].target = 30;
	SRJS.CURRENT_ARENA.addRobot( robby );
	
};
