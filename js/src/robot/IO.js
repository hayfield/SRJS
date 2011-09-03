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
		this.bumpSensor.push( new SRJS.Robot.IO.BumpSensor( this.robot, sensorID ) );
		sensorID++;
	}
	
	
};
