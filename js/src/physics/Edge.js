SRJS.Physics.Edge = function( start, end ){
	
	// start and end positions of edge are of type SRJS.Vector2
	this.start = start;
	//this.start = new SRJS.Vector2(startX, startY);;
	//this.start = new THREE.Vector2(start.x, start.y);
	this.end = end;
	//this.end = new SRJS.Vector2(endX, endY);
	//this.end = new THREE.Vector2(end.x, end.y);
	//console.log('making ed', this.start, this.start.x, this.start.y, this.end);
	/*this.startX = start.x;
	this.startY = start.y;
	this.endX = end.x;
	this.endY = end.y;*/

	
};

SRJS.Physics.Edge.prototype.__defineGetter__('length',
	function(){
		return (this.start.addSelf( this.end )).length;
	}
);
