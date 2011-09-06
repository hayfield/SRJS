SRJS.Physics.Edge = function( start, end ){
	
	// start and end positions of edge are of type SRJS.Vector2
	this.start = start;
	this.end = end;
	
	Object.defineProperty(this, 'length', {
		get: function(){
			return (this.start.addSelf( this.end )).length;
		}
	});
	
};

SRJS.Physics.Edge.prototype.rotateAroundPoint = function( point, theta ){
	this.start.rotateAroundPoint( point, theta );
	this.end.rotateAroundPoint( point, theta );
};

SRJS.Physics.Edge.prototype.translate = function( distance, theta ){
	this.start.translate( distance, theta );
	this.end.translate( distance, theta );
};

// http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
// or see Edge-README.txt
SRJS.Physics.Edge.prototype.intersects = function( other ){
	// collinear or never intersect
	if( this.movement().cross( other.movement() ) === 0 ){
		return false;
	}
	
	var distAlongThisLine = (other.start.subtract( this.start )).cross( other.movement() ) / 
								this.movement().cross( other.movement() ),
		distAlongOtherLine = (other.start.subtract( this.start )).cross( this.movement() ) /
								this.movement().cross( other.movement() );

	// not within the specified parts of the line
	if( distAlongThisLine < 0 || distAlongThisLine > 1
		|| distAlongOtherLine < 0 || distAlongOtherLine > 1 ){
		return false;
	} else { // intersect
		return this.start.add( this.movement().multiply( distAlongThisLine ) );
	}
	
};

SRJS.Physics.Edge.prototype.movement = function(){
	return new SRJS.Vector2( this.end.x - this.start.x, this.end.y - this.start.y );
};
