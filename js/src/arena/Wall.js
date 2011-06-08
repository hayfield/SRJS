SRJS.Wall = function( width, height, depth, position, rotation ){
	
	var geometry = new THREE.Cube( width, height, depth );
	var materials = SRJS.Material.white;
	
	THREE.Mesh.call( this, geometry, materials );
	
	this.position = position instanceof THREE.Vector3 ? position : this.position;
	this.rotation = rotation instanceof THREE.Vector3 ? rotation : this.rotation;
	
	//console.log(this);
	
};

SRJS.Wall.prototype = new THREE.Mesh();
SRJS.Wall.prototype.constructor = SRJS.Wall;
