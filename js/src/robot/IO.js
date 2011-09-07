SRJS.Robot.IO = function( parentRobot ){
	
	var sensorID, finderID;
	
	this.robot = parentRobot;
	
	this.input = function( ID ){
		if( ID < bumpSensor.length ){
			return bumpSensor[ID];
		}
	};
	
	this.bumpSensor = new Array();
	sensorID = 0;
	while( sensorID < this.robot.bumpSensorCount ){
		this.bumpSensor.push( new SRJS.Robot.BumpSensor( this.robot, sensorID ) );
		this.bumpSensor[sensorID].rect.rotateAroundPoint( this.robot.startPosition, this.robot.startRotation );
		sensorID++;
	}
	
	this.rangeFinder = new Array();
	finderID = 0;
	while( finderID < this.robot.rangeFinderCount ){
		this.rangeFinder.push( new SRJS.Robot.RangeFinder( this.robot, finderID ) );
		this.rangeFinder[finderID].ray.rotateAroundPoint( this.robot.startPosition, this.robot.startRotation );
		finderID++;
	}
	
	
};
