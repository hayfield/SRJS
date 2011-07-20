SRJS.Physics.Edge = new function( start, end ){
	
	// start and end positions of edge are of type THREE.Vector2
	this.start = start;
	this.end = end;
	
};

SRJS.Physics.Edge.prototype.__defineGetter__('length',
	function(){
		return (this.start.addSelf( this.end )).length;
	}
);
