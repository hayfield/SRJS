var SRJS = SRJS || {};

SRJS.floatyCam = false;
SRJS.rendererDimension = 200; // window.innerWidth, window.innerHeight
SRJS.addPhysics = true;
SRJS.physicsDimension = 800; // the dimension of the physics canvas
SRJS.displayStats = true;
SRJS.displayRobotVision = false;
SRJS.bumpSensorsPerRobot = 16; // multiple of 4
SRJS.rangeFindersPerRobot = 20; // multiple of 4

SRJS.isZero = function( value ){
	return Math.abs( value ) < 0.00000001;
};

var count = 0;
