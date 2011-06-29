SRJS.Robot = function(){
	
	SRJS.Cube.call( this, 50,
					new THREE.Vector3( 340, 75, 0 ),
					SRJS.Material.green );
	
	this.camera = new THREE.Camera();
	this.addChild( this.camera );
	
	this.motor = new Array();
	this.motor[0] = new SRJS.Motor();
	this.motor[1] = new SRJS.Motor();

};

SRJS.Robot.prototype = new SRJS.Cube();
SRJS.Robot.prototype.constructor = SRJS.Robot;
