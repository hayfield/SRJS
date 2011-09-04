SRJS.Physics.Ray = function( startPosition, rotation, object ){
	
	SRJS.Physics.Polygon.call( this, false, true, object );

	rotation = rotation || 0;
	
	var length = 16777216; // make it long, so it'll hit into anything within the arena
	
	var endPosition = new SRJS.Vector2( startPosition.x, startPosition.y - length );
	endPosition.rotateAroundPoint( startPosition, rotation );
	
	// create the ray
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(startPosition.x, startPosition.y),
										 new SRJS.Vector2(endPosition.x, endPosition.y) ) );
	
};

SRJS.Physics.Ray.prototype = new SRJS.Physics.Polygon();
SRJS.Physics.Ray.prototype.constructor = SRJS.Physics.Ray;
