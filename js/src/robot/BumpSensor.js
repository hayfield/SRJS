/*
	There are (numberOfBumpSensors / 4) bump sensors along the edge of each robot.
	They start in the front-left corner and move round clockwise.
	The corners are not covered.
*/
SRJS.Robot.BumpSensor = function( parentRobot, ID ){
	
	this.robot = parentRobot;
	
	var numberOfBumpSensors = this.robot.bumpSensorCount,
		xPos, yPos;
	
	ID = typeof ID != 'undefined' ? ID : 0;
	this.ID = ID < 0 ? 0 : ID > numberOfBumpSensors ? numberOfBumpSensors : ID;
	
	// code to work out position is pretty much the same for the Range Finder
	var edgeOffset = function( ID, edgeLength ){
		var edgePos = ID % ( numberOfBumpSensors / 4 );
		var offset = -((edgeLength / 2) -
						(edgePos * (edgeLength / (numberOfBumpSensors / 4))) -
						((edgeLength / (numberOfBumpSensors / 4)) / 2) );
		return offset;
	};

	// work out the position of the bump sensor
	if( ID < numberOfBumpSensors / 4 ){ // front
		xPos = this.robot.position.x + edgeOffset( ID, this.robot.width );
		yPos = this.robot.position.z - this.robot.length / 2;
	} else if( ID < (2 * numberOfBumpSensors / 4) ){ // right
		xPos = this.robot.position.x + this.robot.width / 2;
		yPos = this.robot.position.z + edgeOffset( ID, this.robot.length );
	} else if( ID < (3 * numberOfBumpSensors / 4) ){ // back
		xPos = this.robot.position.x - edgeOffset( ID, this.robot.width );
		yPos = this.robot.position.z + this.robot.length / 2;
	} else if( ID < (4 * numberOfBumpSensors / 4) ){ // left
		xPos = this.robot.position.x - this.robot.width / 2;
		yPos = this.robot.position.z - edgeOffset( ID, this.robot.length );
	}
	
	this.rect = new SRJS.Physics.Rectangle( false, true,
									new SRJS.Vector2( this.robot.width / (numberOfBumpSensors / 4),
														this.robot.length / (numberOfBumpSensors / 4) ),
									new SRJS.Vector2( xPos, yPos ),
									0,
									this );
	SRJS.phys.addBumpSensor( this );
	
	this.d = false;
	
	this._aGetter = function(){
		return 0;
	};
	
	Object.defineProperty(this, 'a', {
		get: this._aGetter
	});
	
	this._heightOfBaseGetter = function(){
		return this.robot.heightOfBase;
	};
	
	Object.defineProperty(this, 'heightOfBase', {
		get: this._heightOfBaseGetter
	});
	
	this._heightOfTopGetter = function(){
		return this.robot.heightOfTop;
	};
	
	Object.defineProperty(this, 'heightOfTop', {
		get: this._heightOfTopGetter
	});
	
};
