SRJS.Robot.RangeFinder = function( parentRobot, ID ){
	
	this.robot = parentRobot;
	
	ID = ID || 0;
	this.ID = ID < 0 ? 0 : ID > SRJS.rangeFindersPerRobot ? SRJS.rangeFindersPerRobot : ID;
	
	// code to work out position is pretty much the same for the Bump Sensor
	var xPos, yPos, rotation;
	var edgeOffset = function( ID, edgeLength ){
		var edgePos = ID % ( SRJS.rangeFindersPerRobot / 4 );
		var offset = -((edgeLength / 2) -
						(edgePos * (edgeLength / (SRJS.rangeFindersPerRobot / 4))) -
						((edgeLength / (SRJS.rangeFindersPerRobot / 4)) / 2) );
		return offset;
	};

	// work out the position of the bump sensor
	if( ID < SRJS.rangeFindersPerRobot / 4 ){ // front
		xPos = this.robot.position.x + edgeOffset( ID, this.robot.width );
		yPos = this.robot.position.z - this.robot.length / 2;
		rotation = 0;
	} else if( ID < (2 * SRJS.rangeFindersPerRobot / 4) ){ // right
		xPos = this.robot.position.x + this.robot.width / 2;
		yPos = this.robot.position.z + edgeOffset( ID, this.robot.length );
		rotation = Math.PI * 1.5;
	} else if( ID < (3 * SRJS.rangeFindersPerRobot / 4) ){ // back
		xPos = this.robot.position.x - edgeOffset( ID, this.robot.width );
		yPos = this.robot.position.z + this.robot.length / 2;
		rotation = Math.PI;
	} else if( ID < (4 * SRJS.rangeFindersPerRobot / 4) ){ // left
		xPos = this.robot.position.x - this.robot.width / 2;
		yPos = this.robot.position.z - edgeOffset( ID, this.robot.length );
		rotation = Math.PI * 0.5;
	}
	
	this.ray = new SRJS.Physics.Ray( new SRJS.Vector2( xPos, yPos ),
										rotation, this );
	
	SRJS.phys.addRangeFinder( this );
	
	this._aGetter = function(){
		var raw = this.ray.distanceToIntersection,
			value = 0;
		if( raw > 0 ){
			value = 125 / raw;
			value = value > 3.3 ? 3.3 : value;
		} else if( raw === 0 ){
			value = 3.3;
		}
		return value;
	};
	
	Object.defineProperty(this, 'a', {
		get: this._aGetter
	});
	
};
