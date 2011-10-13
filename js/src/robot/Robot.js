SRJS.Robot = function( args ){
args = typeof args == 'undefined' ? {} : args;
if( SRJS.CURRENT_ARENA.robots.length < SRJS.CURRENT_ARENA.robotStartPositions.length ){
	
	this.startPosition = SRJS.CURRENT_ARENA.robotStartPositions[ SRJS.CURRENT_ARENA.robots.length ];
	this.startRotation = SRJS.CURRENT_ARENA.robotStartRotations[ SRJS.CURRENT_ARENA.robots.length ] || 0;
	
	var roundToMultipleOfFour = function( val ){
		if( val < 4 ){
			return 4;
		}
		return Math.ceil( val / 4.0 ) * 4;
	};
	this.bumpSensorCount = args.bumpSensorCount || args.numberOfBumpSensors || SRJS.bumpSensorsPerRobot;
	this.rangeFinderCount = args.rangeFinderCount || args.numberOfRangeFinders || SRJS.rangeFindersPerRobot;
	this.bumpSensorCount = roundToMultipleOfFour( this.bumpSensorCount );
	this.rangeFinderCount = roundToMultipleOfFour( this.rangeFinderCount );
	
	var defaultDimension = 50;
	
	this.height = 50;
	//this.height = typeof args.height === 'number' ? args.height : defaultDimension;
	this.width = typeof args.width === 'number' ? args.width : defaultDimension;
	this.length = typeof args.length === 'number' ? args.length : defaultDimension;
	
	SRJS.Cube.call( this, this.height,
					new THREE.Vector3( this.startPosition.x, 50 + this.height / 2, this.startPosition.y ),
					SRJS.Material.green );
	
	this.io = new SRJS.Robot.IO( this ); // need to initialise the IO before rotating the robot
	
	this.rotate( this.startRotation );
	
	this.camera = new THREE.Camera();
	this.addChild( this.camera );
	
	this.lastUpdate = Date.now();
	
	this.speed = args.speed || 1;
	
	// motor[0] is the left wheel, motor[1] is the right one
	this.motor = new Array();
	this.motor[0] = new SRJS.Motor();
	this.motor[1] = new SRJS.Motor();
	
	this.bindCallbackToRobot = function( callback ){
		// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
		var boundCallback = function(){
			var boundCallback = callback.bind( this );
			// Since we don't know when the callback will be called, we'll need to reassign
			// robot so that it's referring to the correct thing
			robot = this;
            //callback.apply( this, arguments );
            arguments.length === 0 ? boundCallback() : boundCallback( arguments[0] );
		}.bind( this );
		
		return boundCallback;
	};
	
	this._continueTime = Date.now();	
	this.Yield = function( seconds, callback ){
		if( seconds instanceof SRJS.Query ){
			this._continueTime = Number.MAX_VALUE;
			
			seconds.callback = typeof callback === 'function' ? function( status ){
				this._continueTime = Date.now();
				var boundCallback = this.bindCallbackToRobot( callback );
				boundCallback( status );
			}.bind( this ) : function(){ this._continueTime = Date.now(); }.bind( this );
			seconds.callWatchers();
		} else {
			this._continueTime = Date.now() + seconds * 1000;
			
			callback = typeof callback === 'function' ? callback : function(){};
			window.setTimeout( this.bindCallbackToRobot( callback ),
									seconds * 999 );
		}
	};
    
    this.wait_for = this.Yield;
    this.waitFor = this.Yield;
	
	this.invokeRepeating = function( callback, initialDelay, repeatRate ){
		if( callback && typeof callback === 'function' ){
			SRJS.invokeRepeating( this.bindCallbackToRobot( callback ),
									initialDelay, repeatRate );
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
	
	this.initialise = typeof args.initialise === 'function' ? args.initialise : function(){
		
	};
	
	this.vision = SRJS.Vision( this );
	
	this.gameScore = 0;
	this.gameSettings = {};
	
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
	var prop;
	for( prop in this ){
		if( this.hasOwnProperty(prop) ){
			this._reservedPropertyNames.push( prop );
		}
	}
	robot = this;
	this.initialise();

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
