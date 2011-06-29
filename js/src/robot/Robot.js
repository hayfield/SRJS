SRJS.Robot = function(){
	
	SRJS.Cube.call( this, 50,
					new THREE.Vector3( 340, 75, -340 ),
					SRJS.Material.green );
	
	

};

SRJS.Robot.prototype = new SRJS.Cube();
SRJS.Robot.prototype.constructor = SRJS.Robot;
