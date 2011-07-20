SRJS.Wall = function( width, height, depth, position, rotation, material ){
if( arguments.length > 0 ){	// prevent the code being run on the constructor call from SRJS.Cube/Trigger
	var geometry = new THREE.CubeGeometry( width, height, depth );
	var materials = material || SRJS.Material.white;
	
	THREE.Mesh.call( this, geometry, materials );
	
	this.position = position instanceof THREE.Vector3 ? position : this.position;
	this.rotation = rotation instanceof THREE.Vector3 ? rotation : this.rotation;
	
	SRJS.phys.addPolygon( new SRJS.Physics.Rectangle( !(this instanceof SRJS.Robot), this instanceof SRJS.Trigger,
														new SRJS.Vector2( width, depth ),
														new SRJS.Vector2( this.position.x, this.position.z ),
														this.rotation.y ));

}	
};

SRJS.Wall.prototype = new THREE.Mesh();
SRJS.Wall.prototype.constructor = SRJS.Wall;
