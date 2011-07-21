SRJS.Physics.Edge = function( start, end ){
	
	// start and end positions of edge are of type SRJS.Vector2
	this.start = start;
	//this.start = new THREE.Vector2(start.x, start.y);
	this.end = end;
	//this.end = new THREE.Vector2(end.x, end.y);
	
};

SRJS.Physics.Edge.prototype.rotateAroundPoint = function( point, theta ){
	this.start.rotateAroundPoint( point, theta );
	this.end.rotateAroundPoint( point, theta );
};

SRJS.Physics.Edge.prototype.translate = function( distance, theta ){
	this.start.translate( distance, theta );
	this.end.translate( distance, theta );
};

SRJS.Physics.Edge.prototype.__defineGetter__('length',
	function(){
		return (this.start.addSelf( this.end )).length;
	}
);
