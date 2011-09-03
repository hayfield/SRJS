/*
	There are (SRJS.bumpSensorsPerRobot / 4) bump sensors along the edge of each robot.
	They start in the front-left corner and move round clockwise.
	The corners are not covered.
*/
SRJS.Robot.BumpSensor = function( parentRobot, ID ){
	
	this.robot = parentRobot;
	
	ID = ID || 0;
	this.ID = ID < 0 ? 0 : ID > SRJS.bumpSensorsPerRobot ? SRJS.bumpSensorsPerRobot : ID;
	
	var xPos, yPos;
	var edgeOffset = function( ID, edgeLength ){
		var edgePos = ID % ( SRJS.bumpSensorsPerRobot / 4 );
		var offset = -((edgeLength / 2) -
						(edgePos * (edgeLength / (SRJS.bumpSensorsPerRobot / 4))) -
						((edgeLength / (SRJS.bumpSensorsPerRobot / 4)) / 2) );
		return offset;
	};

	// work out the position of the bump sensor
	if( ID < SRJS.bumpSensorsPerRobot / 4 ){ // front
		xPos = this.robot.position.x + edgeOffset( ID, this.robot.width );
		yPos = this.robot.position.z - this.robot.length / 2;
	} else if( ID < (2 * SRJS.bumpSensorsPerRobot / 4) ){ // right
		xPos = this.robot.position.x + this.robot.width / 2;
		yPos = this.robot.position.z + edgeOffset( ID, this.robot.length );
	} else if( ID < (3 * SRJS.bumpSensorsPerRobot / 4) ){ // back
		xPos = this.robot.position.x - edgeOffset( ID, this.robot.width );
		yPos = this.robot.position.z + this.robot.length / 2;
	} else if( ID < (4 * SRJS.bumpSensorsPerRobot / 4) ){ // left
		xPos = this.robot.position.x - this.robot.width / 2;
		yPos = this.robot.position.z - edgeOffset( ID, this.robot.length );
	}
	//console.log(xPos, yPos, this.robot.position.x, this.robot.position.z);

	this.rect = new SRJS.Physics.Rectangle/*SRJS.Physics.Rectangle.call*/( false, true,
									new SRJS.Vector2( this.robot.width / (SRJS.bumpSensorsPerRobot / 4),
														this.robot.length / (SRJS.bumpSensorsPerRobot / 4) ),
									new SRJS.Vector2( xPos, yPos ),
									0,
									this );
	SRJS.phys.addBumpSensor( this.rect );
	
	this.bumped = function(){
		return false;
	};
	
};

//SRJS.Robot.BumpSensor.prototype = new SRJS.Physics.Rectangle();
//SRJS.Robot.BumpSensor.prototype.constructor = SRJS.Robot.BumpSensor;

SRJS.Robot.BumpSensor.prototype.__defineGetter__('d',
	function(){
		return this.bumped();
	}
);

SRJS.Robot.BumpSensor.prototype.__defineGetter__('a',
	function(){
		return 0;
	}
);
