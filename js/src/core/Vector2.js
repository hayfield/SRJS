SRJS.Vector2 = function( x, y ){
	
	// by creating it as an instanceof THREE.Vector2, the values will randomly change
	//THREE.Vector2.call( this, x, y );
	this.x = x;
	this.y = y;
	
};

//SRJS.Vector2.prototype = new THREE.Vector2();
//SRJS.Vector2.prototype.constructor = SRJS.Vector2;

SRJS.Vector2.prototype.toPhysicsCanvasCoords = function(){
	return new SRJS.Vector2( this.x * (SRJS.physicsDimension / SRJS.arenaDimension) + SRJS.physicsDimension / 2,
							 this.y * (SRJS.physicsDimension / SRJS.arenaDimension) + SRJS.physicsDimension / 2 );
};
