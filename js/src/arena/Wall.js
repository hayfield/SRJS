SRJS.Wall = function( width, height, depth, position, rotation, material ){
if( arguments.length > 0 ){	// prevent the code being run on the constructor call from SRJS.Cube/Trigger
	var geometry = new THREE.CubeGeometry( width, height, depth ),
		materials = material || SRJS.Material.white;
	
	this.wallWidth = width;
	this.wallHeight = height;
	this.wallDepth = depth;
	
	THREE.Mesh.call( this, geometry, materials );
	
	this.position = position instanceof THREE.Vector3 ? position : this.position;
	this.rotation = rotation instanceof THREE.Vector3 ? rotation : this.rotation;
	
	SRJS.phys.addPolygon( new SRJS.Physics.Rectangle( !(this instanceof SRJS.Robot), this instanceof SRJS.Trigger,
														new SRJS.Vector2( width, depth ),
														new SRJS.Vector2( this.position.x, this.position.z ),
														this.rotation.y, this ));

	this._heightOfBaseGetter = function(){
		return this.position.y - this.wallHeight / 2;
	};
	
	Object.defineProperty(this, 'heightOfBase', {
		get: this._heightOfBaseGetter
	});
	
	this._heightOfTopGetter = function(){
		return this.position.y + this.wallHeight / 2;
	};
	
	Object.defineProperty(this, 'heightOfTop', {
		get: this._heightOfTopGetter
	});
}	
};

SRJS.Wall.prototype = new THREE.Mesh();
SRJS.Wall.prototype.constructor = SRJS.Wall;
