SRJS.Physics.Rectangle = function( fixed, trigger, dimension, position, rotation, object ){
	
	SRJS.Physics.Polygon.call( this, fixed, trigger, object );

	rotation = rotation || 0;
	
	var topLeft = new SRJS.Vector2( position.x - (dimension.x / 2),
									 position.y - (dimension.y / 2) );
	var topRight = new SRJS.Vector2( position.x + (dimension.x / 2),
									  position.y - (dimension.y / 2) );
	var bottomLeft = new SRJS.Vector2( position.x - (dimension.x / 2),
										position.y + (dimension.y / 2) );
	var bottomRight = new SRJS.Vector2( position.x + (dimension.x / 2),
										 position.y + (dimension.y / 2) );
	
	topLeft.rotateAroundPoint( position, rotation );
	topRight.rotateAroundPoint( position, rotation );
	bottomLeft.rotateAroundPoint( position, rotation );
	bottomRight.rotateAroundPoint( position, rotation );
	
	// top
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(topLeft.x, topLeft.y),
										 new SRJS.Vector2(topRight.x, topRight.y) ));
	// bottom
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(bottomLeft.x, bottomLeft.y),
										 new SRJS.Vector2(bottomRight.x, bottomRight.y) ));
	// left
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(topLeft.x, topLeft.y),
										 new SRJS.Vector2(bottomLeft.x, bottomLeft.y) ));
	// right
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(topRight.x, topRight.y),
										 new SRJS.Vector2(bottomRight.x, bottomRight.y) ));
	
};

SRJS.Physics.Rectangle.prototype = new SRJS.Physics.Polygon();
SRJS.Physics.Rectangle.prototype.constructor = SRJS.Physics.Rectangle;
