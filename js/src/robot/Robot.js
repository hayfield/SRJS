SRJS.Robot = function( args ){
args = typeof args == 'undefined' ? {} : args;
if( SRJS.CURRENT_ARENA.robots.length < SRJS.CURRENT_ARENA.robotStartPositions.length ){
	
	this.startPosition = SRJS.CURRENT_ARENA.robotStartPositions[ SRJS.CURRENT_ARENA.robots.length ];
	
	this.startRotation = SRJS.CURRENT_ARENA.robotStartRotations[ SRJS.CURRENT_ARENA.robots.length ] || 0;
	
	var defaultDimension = 50;
	
	this.height = 50;
	//this.height = typeof args.height === 'number' ? args.height : defaultDimension;
	this.width = typeof args.width === 'number' ? args.width : defaultDimension;
	this.length = typeof args.length === 'number' ? args.length : defaultDimension;
	
	SRJS.Cube.call( this, this.height,
					new THREE.Vector3( this.startPosition.x, 75, this.startPosition.y ),
					SRJS.Material.green );
	
	this.io = new SRJS.Robot.IO( this ); // need to initialise the IO before rotating the robot

	this.rotate( this.startRotation );
	
	this.camera = new THREE.Camera();
	this.addChild( this.camera );
	
	this.lastUpdate = Date.now();
	
	this.speed = 1;
	
	// motor[0] = left, motor[1] = right
	this.motor = new Array();
	this.motor[0] = new SRJS.Motor();
	this.motor[1] = new SRJS.Motor();
	
	this._continueTime = Date.now();	
	this.yield = function( seconds, callback ){
		this._continueTime = Date.now() + seconds * 1000;
		if( callback && typeof callback === 'function' ){
			// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
			boundCallback = callback.bind( this );
			window.setTimeout( boundCallback, seconds * 999 );
		}
	};
	
	this.runFrame = function(){
		if( Date.now() > this._continueTime ){
			robot = this;
			this.main();
		}
	};
	
	this.main = typeof args.main === 'function' ? args.main : function(){
		
	};
	
	this.motor[0].target = 40;
	this.motor[1].target = 50;
	
	this.vision = new SRJS.Vision();
	
	this.gameScore = 0;
	
	this._reservedPropertyNames = new Array();
	this._customPropertyNames = new Array();
	/*
		Allows values to easily persist between multiple calls to this.main()
		Doesn't allow properties to be set that are used for the internals.
		Returns true or false depending on whether setting the property was successful.
	*/
	this.createProperty = function( name, initialValue ){
		if( typeof name !== 'string' ){
			return false;
		}
		if( this._reservedPropertyNames.indexOf( name ) === -1 ){
			// don't reset the value each time this.main() is called
			if( this._customPropertyNames.indexOf( name ) === -1 ){
				this[name] = initialValue;
				this._customPropertyNames.push( name );
			}
			return true;
		}
		return false;
	};
	
	// initialise the reserved proprty names array
	for( var prop in this ){
		if( this.hasOwnProperty(prop) ){
			this._reservedPropertyNames.push( prop );
		}
	}

}
};

SRJS.Robot.prototype = new SRJS.Cube();
SRJS.Robot.prototype.constructor = SRJS.Robot;

SRJS.Robot.prototype.rotate = function( theta ){
	this.rotation.y += theta;
};

SRJS.Robot.prototype.moveForward = function( distance ){
	this.translateZ( distance );
};
