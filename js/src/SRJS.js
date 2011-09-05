var SRJS = SRJS || {};

SRJS.floatyCam = false;
SRJS.rendererDimension = 200; // window.innerWidth, window.innerHeight
SRJS.addPhysics = true;
SRJS.physicsDimension = 800; // the dimension of the physics canvas
SRJS.displayStats = true;
SRJS.displayRobotVision = false;
SRJS.bumpSensorsPerRobot = 16; // multiple of 4
SRJS.rangeFindersPerRobot = 4; // multiple of 4

SRJS.isZero = function( value ){
	return Math.abs( value ) < 0.00000001;
};

SRJS.invokeRepeating = function( callback, delay ){
	if( typeof callback !== 'function' || typeof delay !== 'number' ){
		console.error('SRJS.invokeRepeating(callback, delay) requires two parameters.\n',
						'The first is the function which is to be repeated.\n',
						'The second is the delay between calls to the function in milliseconds.\n\n',
						'The following parameters were provided:', arguments);
	} else {
		var repeating = function(){
			callback();
			window.setTimeout( repeating, delay );
		};
		repeating();
	}
};

var count = 0;
