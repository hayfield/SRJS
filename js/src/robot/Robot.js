SRJS.Robot = function(){
	
	SRJS.Cube.call( this, 50,
					new THREE.Vector3( 340, 75, 0 ),
					SRJS.Material.green );
	
	/*this.camera = new THREE.Camera();
	this.camera.position = this.position;
	this.camera.rotation = this.rotation;*/
	
	this.addChild( new THREE.Camera() );
	this.camera = this.children[0];
	this.children[0].rotation.x = Math.PI;
	
	console.log('pos', this.position, this);
	

};

SRJS.Robot.prototype = new SRJS.Cube();
SRJS.Robot.prototype.constructor = SRJS.Robot;
