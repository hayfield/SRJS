SRJS.Init = function(){

	SRJS.phys = new SRJS.Physics.Environment();
	var bob = new SRJS.Arena2011();
	
	SRJS.CURRENT_ARENA.addRobot();
	var robby = new SRJS.Robot();
	robby.motor[0].target = 30;
	SRJS.CURRENT_ARENA.addRobot( robby );
	SRJS.CURRENT_ARENA.addRobot();
	SRJS.CURRENT_ARENA.robots[2].motor[0].target = 35;
	SRJS.CURRENT_ARENA.addRobot();
	SRJS.CURRENT_ARENA.robots[3].motor[0].target = 45;
	
	
};
