var SRJS = SRJS || {};

SRJS.floatyCam = false;
SRJS.rendererDimension = 200; // window.innerWidth, window.innerHeight
SRJS.addPhysics = true;
SRJS.physicsDimension = 800; // the dimension of the physics canvas
SRJS.displayStats = false;
SRJS.displayRobotVision = false;
SRJS.intersections = new Array();

SRJS.isZero = function( value ){
	return Math.abs( value ) < 0.00000001;
};

var count = 0;
