SRJS.Robot = function(){
	
	SRJS.Cube.call( this, 50,
					new THREE.Vector3( 340, 75, 0 ),
					SRJS.Material.green );
	
	this.camera = new THREE.Camera();
	this.addChild( this.camera );
	
	this.lastUpdate = Date.now();
	
	this.speed = 1;
	
	// motor[0] = left, motor[1] = right
	this.motor = new Array();
	this.motor[0] = new SRJS.Motor();
	this.motor[1] = new SRJS.Motor();
	
	this.main = function(){
		
	};
	
	this.motor[0].target = 40;
	this.motor[1].target = 50;
	
	this.vision = new SRJS.Vision();

};

SRJS.Robot.prototype = new SRJS.Cube();
SRJS.Robot.prototype.constructor = SRJS.Robot;

SRJS.Robot.prototype.rotate = function( theta ){
	this.rotation.y += theta;
};

SRJS.Robot.prototype.moveForward = function( distance ){
	this.translateZ( distance );
};
