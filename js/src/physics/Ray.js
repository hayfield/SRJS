SRJS.Physics.Ray = function( startPosition, rotation, object ){
	
	this.parent = object;

	SRJS.Physics.Polygon.call( this, false, true, object );

	rotation = typeof rotation != 'undefined' ? rotation : 0;
	
	var length = 16777216; // make it long, so it'll hit into anything within the arena
	
	var endPosition = new SRJS.Vector2( startPosition.x, startPosition.y - length );
	endPosition.rotateAroundPoint( startPosition, rotation );
	
	// create the ray
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(startPosition.x, startPosition.y),
										 new SRJS.Vector2(endPosition.x, endPosition.y) ) );
	
	this.intersections = new SRJS.Physics.Intersections();
	
	this.nearestIntersection = this.edges[0].end;
	
	this._distanceToIntersectionGetter = function(){
		return this.edges[0].start.distanceTo( this.nearestIntersection );
	};
	
	Object.defineProperty(this, 'distanceToIntersection', {
		get: this._distanceToIntersectionGetter
	});
	
};

SRJS.Physics.Ray.prototype = new SRJS.Physics.Polygon();
SRJS.Physics.Ray.prototype.constructor = SRJS.Physics.Ray;
