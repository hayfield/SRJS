SRJS.Robot = function(){
if( SRJS.CURRENT_ARENA.robots.length < SRJS.CURRENT_ARENA.robotStartPositions.length ){
	
	var startPosition = SRJS.CURRENT_ARENA.robotStartPositions[ SRJS.CURRENT_ARENA.robots.length ];
	
	this.height = this.width = this.length = 50;
	
	SRJS.Cube.call( this, this.height,
					new THREE.Vector3( startPosition.x, 75, startPosition.y ),
					SRJS.Material.green );
	
	this.rotate( SRJS.CURRENT_ARENA.robotStartRotations[ SRJS.CURRENT_ARENA.robots.length ] );
	
	this.camera = new THREE.Camera();
	this.addChild( this.camera );
	
	this.lastUpdate = Date.now();
	
	this.speed = 1;
	
	this.io = new SRJS.Robot.IO();
	
	// motor[0] = left, motor[1] = right
	this.motor = new Array();
	this.motor[0] = new SRJS.Motor();
	this.motor[1] = new SRJS.Motor();
	
	this.main = function(){
		
	};
	
	this.motor[0].target = 40;
	this.motor[1].target = 50;
	
	this.vision = new SRJS.Vision();
	
	this.gameScore = 0;
	
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
