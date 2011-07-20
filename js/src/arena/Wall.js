SRJS.Wall = function( width, height, depth, position, rotation, material ){
	
	var geometry = new THREE.CubeGeometry( width, height, depth );
	var materials = material || SRJS.Material.white;
	
	THREE.Mesh.call( this, geometry, materials );
	
	this.position = position instanceof THREE.Vector3 ? position : this.position;
	this.rotation = rotation instanceof THREE.Vector3 ? rotation : this.rotation;
	
	SRJS.phys.addPolygon( new SRJS.Physics.Rectangle( true, true,
														new THREE.Vector2( width, depth ),
														new THREE.Vector2( this.position.x, this.position.z ) ));
	
	//console.log(this);
	
};

SRJS.Wall.prototype = new THREE.Mesh();
SRJS.Wall.prototype.constructor = SRJS.Wall;
