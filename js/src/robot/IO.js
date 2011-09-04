SRJS.Robot.IO = function( parentRobot ){
	
	this.robot = parentRobot;
	
	this.input = function( ID ){
		if( ID < bumpSensor.length ){
			return bumpSensor[ID];
		}
	};
	
	this.bumpSensor = new Array();
	var sensorID = 0;
	while( sensorID < SRJS.bumpSensorsPerRobot ){
		this.bumpSensor.push( new SRJS.Robot.BumpSensor( this.robot, sensorID ) );
		this.bumpSensor[sensorID].rect.rotateAroundPoint( this.robot.startPosition, this.robot.startRotation );
		sensorID++;
	}
	
	
};
