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
	
		// translate back to the original position
		x += point.x;
		y += point.y;
		
		this.x = x;
		this.y = y;
	}
};

SRJS.Vector2.prototype.translate = function( distance, theta ){
	var c = Math.cos( theta ), s = Math.sin( theta );
	
	this.x += distance * s;
	this.y += distance * c;
};

SRJS.Vector2.prototype.cross = function( other ){
	return (this.x * other.y) - (this.y * other.x);
};

SRJS.Vector2.prototype.add = function( other ){
	return new SRJS.Vector2( this.x + other.x, this.y + other.y );
};

SRJS.Vector2.prototype.subtract = function( other ){
	return new SRJS.Vector2( this.x - other.x, this.y - other.y );
};

SRJS.Vector2.prototype.multiply = function( value ){
	return new SRJS.Vector2( this.x * value, this.y * value );
};

SRJS.Vector2.prototype.lengthSquared = function(){
	return this.x * this.x + this.y * this.y;
};

SRJS.Vector2.prototype.length = function(){
	return Math.sqrt( this.lengthSquared() );
};

SRJS.Vector2.prototype.distanceToSquared = function( other ){
	var dx = this.x - other.x, dy = this.y - other.y;
	return dx * dx + dy * dy;
};

SRJS.Vector2.prototype.distanceTo = function( other ){
	return Math.sqrt( this.distanceToSquared( other ) );
};
