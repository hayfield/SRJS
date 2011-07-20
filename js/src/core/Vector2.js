SRJS.Vector2 = function( x, y ){
	
	// by creating it as an instanceof THREE.Vector2, the values will randomly change
	//THREE.Vector2.call( this, x, y );
	this.x = x;
	this.y = y;
	
};

//SRJS.Vector2.prototype = new THREE.Vector2();
//SRJS.Vector2.prototype.constructor = SRJS.Vector2;

SRJS.Vector2.prototype.toPhysicsCanvasCoords = function(){
	return new SRJS.Vector2( this.x * (SRJS.physicsDimension / SRJS.CURRENT_ARENA.arenaDimension) + SRJS.physicsDimension / 2,
							 this.y * (SRJS.physicsDimension / SRJS.CURRENT_ARENA.arenaDimension) + SRJS.physicsDimension / 2 );
};

SRJS.Vector2.prototype.rotateAroundPoint = function( point, theta ){
	point = point || new SRJS.Vector2( 0, 0 );
	
	// translate so the point to rotate around is the origin
	this.x -= point.x;
	this.y -= point.y;
	
	// perform the rotation - http://en.wikipedia.org/wiki/Rotation_matrix
	var c = Math.cos( theta ), s = Math.sin( theta );
	this.x = (this.x * c) + (this.y * s);
	this.y = (this.x * -s) + (this.y * c);
	
	// translate back to the original position
	this.x += point.x;
	this.y += point.y;
};
