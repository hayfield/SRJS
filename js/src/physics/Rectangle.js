SRJS.Physics.Rectangle = function( fixed, trigger, dimension, position ){
	
	SRJS.Physics.Polygon.call( this, fixed, trigger );
	
	var topLeft = new THREE.Vector2( position.x - (dimension.x / 2),
									 position.y - (dimension.y / 2) );
	var topRight = new THREE.Vector2( position.x + (dimension.x / 2),
									  position.y - (dimension.y / 2) );
	var bottomLeft = new THREE.Vector2( position.x - (dimension.x / 2),
										position.y + (dimension.y / 2) );
	var bottomRight = new THREE.Vector2( position.x + (dimension.x / 2),
										 position.y + (dimension.y / 2) );
	
	// top
	this.addEdge( new SRJS.Physics.Edge( topLeft, topRight ));
	// bottom
	this.addEdge( new SRJS.Physics.Edge( bottomLeft, bottomRight ));
	// left
	this.addEdge( new SRJS.Physics.Edge( topLeft, bottomLeft ));
	// right
	this.addEdge( new SRJS.Physics.Edge( topRight, bottomRight ));
	
};

SRJS.Physics.Rectangle.prototype = new SRJS.Physics.Polygon();
SRJS.Physics.Rectangle.prototype.constructor = SRJS.Physics.Rectangle;
