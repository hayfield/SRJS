SRJS.Physics.Edge = function( startX, startY, endX, endY ){
	
	// start and end positions of edge are of type THREE.Vector2
	//this.start = start;
	this.start = new THREE.Vector2(startX, startY);;
	//this.start = new THREE.Vector2(start.x, start.y);
	//this.end = end;
	this.end = new THREE.Vector2(endX, endY);
	//this.end = new THREE.Vector2(end.x, end.y);
	console.log('making ed', this.start, this.end, startX, startY, endX, endY);
	/*this.startX = start.x;
	this.startY = start.y;
	this.endX = end.x;
	this.endY = end.y;*/
	this.startX = startX;
	this.startY = startY;
	this.endX = endX;
	this.endY = endY;
	
};

SRJS.Physics.Edge.prototype.__defineGetter__('length',
	function(){
		return (this.start.addSelf( this.end )).length;
	}
);
