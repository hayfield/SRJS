SRJS.Robot = function(){
	
	SRJS.Cube.call( this, 50,
					new THREE.Vector3( 340, 75, 0 ),
					SRJS.Material.green );
	
	this.camera = new THREE.Camera();
	this.addChild( this.camera );
	
	console.log('pos', this.position, this);
	

};

SRJS.Robot.prototype = new SRJS.Cube();
SRJS.Robot.prototype.constructor = SRJS.Robot;
