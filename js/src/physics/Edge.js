SRJS.Physics.Line = new function( start, end ){
	
	// start and end positions of line are of type THREE.Vector2
	this.start = start;
	this.end = end;
	
};

SRJS.Physics.Line.prototype.__defineGetter__('length',
	function(){
		return (this.start.addSelf( this.end )).length;
	}
);
