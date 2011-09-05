SRJS.Physics.Ray = function( startPosition, rotation, object ){
	
	SRJS.Physics.Polygon.call( this, false, true, object );

	rotation = rotation || 0;
	
	var length = 16777216; // make it long, so it'll hit into anything within the arena
	
	var endPosition = new SRJS.Vector2( startPosition.x, startPosition.y - length );
	endPosition.rotateAroundPoint( startPosition, rotation );
	
	// create the ray
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(startPosition.x, startPosition.y),
										 new SRJS.Vector2(endPosition.x, endPosition.y) ) );
	
	this.intersections = new SRJS.Physics.Intersections();
	
	this.nearestIntersection = this.edges[0].end;
	/*function(){
		var intersection = this.intersections.nearestTo( this.edges[0].start, true, false );
		if( intersection ){
			return intersection;
		} else {
			return this.edges[0].end;
		}
	};*/
	
};

SRJS.Physics.Ray.prototype = new SRJS.Physics.Polygon();
SRJS.Physics.Ray.prototype.constructor = SRJS.Physics.Ray;

SRJS.Physics.Ray.prototype.__defineGetter__('distanceToIntersection',
	function(){
		return this.edges[0].start.distanceTo( this.nearestIntersection );
	}
);
