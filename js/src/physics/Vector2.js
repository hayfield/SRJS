SRJS.Vector2 = function( x, y ){
	
	// by creating it as an instanceof THREE.Vector2, the values will randomly change
	//THREE.Vector2.call( this, x, y );
	this.x = x;
	this.y = y;
	
};

//SRJS.Vector2.prototype = new THREE.Vector2();
//SRJS.Vector2.prototype.constructor = SRJS.Vector2;
