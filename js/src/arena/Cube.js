SRJS.Cube = function( dimension, position, material ){
	
	SRJS.Wall.call( this, dimension, dimension, dimension,
						position || new THREE.Vector3(),
						new THREE.Vector3(),
						material
					);

};

SRJS.Cube.prototype = new SRJS.Wall();
SRJS.Cube.prototype.constructor = SRJS.Cube;
