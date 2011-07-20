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
	if( theta !== 0 ){
		point = point || new SRJS.Vector2( 0, 0 );
		
		var x, y, xBefore;
		x = this.x;
		y = this.y;
		
		// translate so the point to rotate around is the origin
		xBefore = x -= point.x;
		y -= point.y;
		
		// perform the rotation - http://en.wikipedia.org/wiki/Rotation_matrix
		var c = Math.cos( theta ), s = Math.sin( theta );
		c = SRJS.isZero( c ) ? 0 : c;
		s = SRJS.isZero( s ) ? 0 : s;
	
		x = (x * c) + (y * s);
		y = (xBefore * -s) + (y * c);
		console.log(x, y);
	
		// translate back to the original position
		x += point.x;
		y += point.y;
		
		this.x = x;
		this.y = y;
	}
};

SRJS.isZero = function( value ){
	return Math.abs( value ) < 0.00000001;
};
