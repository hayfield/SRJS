SRJS.Cube = function( dimension, position, material ){
if( arguments.length > 0 ){ // prevent the code being run on the constructor call from SRJS.Robot
	//console.log('cube');
	SRJS.Wall.call( this, dimension, dimension, dimension,
						position || new THREE.Vector3(),
						new THREE.Vector3(),
						material
					);
}
};

SRJS.Cube.prototype = new SRJS.Wall();
SRJS.Cube.prototype.constructor = SRJS.Cube;
