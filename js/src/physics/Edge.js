SRJS.Physics.Edge = function( start, end ){
	
	// start and end positions of edge are of type SRJS.Vector2
	this.start = start;
	this.end = end;
	
	this._lengthGetter = function(){
		return (this.start.addSelf( this.end )).length;
	};
	
	Object.defineProperty(this, 'length', {
		get: this._lengthGetter
	});
	
	this._normalGetter = function(){
		return new SRJS.Vector2( -(this.end.y - this.start.y), (this.end.x - this.start.x) );
	};
	
	Object.defineProperty(this, 'normal', {
		get: this._normalGetter
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
	// cache the values so we aren't creating lots and lots of Vectors that are the same
	var thisMovement = this.movement(),
		otherMovement = other.movement();
    
	// collinear or never intersect
	if( thisMovement.cross( otherMovement ) === 0 ){
		return false;
	}
	
	var distAlongThisLine = (other.start.subtract( this.start )).cross( otherMovement ) / 
								thisMovement.cross( otherMovement ),
		distAlongOtherLine = (other.start.subtract( this.start )).cross( thisMovement ) /
								thisMovement.cross( otherMovement );

	// not within the specified parts of the line
	if( distAlongThisLine < 0 || distAlongThisLine > 1
		|| distAlongOtherLine < 0 || distAlongOtherLine > 1 ){
		return false;
	} else { // intersect
		return this.start.add( thisMovement.multiply( distAlongThisLine ) );
	}
	
};

SRJS.Physics.Edge.prototype.movement = function(){
	return new SRJS.Vector2( this.end.x - this.start.x, this.end.y - this.start.y );
};
