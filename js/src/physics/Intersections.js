SRJS.Physics.Intersections = function(){
	
	Array.call( this );
	
	this.solids = new Array();
	this.triggers = new Array();
	
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort
	this.sortFunction = function( a, b ){
		var aDistance = a.subtract( SRJS.Physics.Intersections._sortPoint ).length();
		var bDistance = b.subtract( SRJS.Physics.Intersections._sortPoint ).length();
		
		return aDistance - bDistance;
	};
	
};
var count = 0;

SRJS.Physics.Intersections.prototype = new Array();
SRJS.Physics.Intersections.prototype.constructor = SRJS.Physics.Intersections;

SRJS.Physics.Intersections.prototype.push = function( location, trigger ){
	if( trigger ){
		this.triggers.push( location );
	} else {
		this.solids.push( location );
	}
};

SRJS.Physics.Intersections.prototype.clear = function(){
	this.solids.length = 0;
	this.triggers.length = 0;
};

SRJS.Physics.Intersections.prototype.nearestTo = function( point, includeSolids, includeTriggers ){
	SRJS.Physics.Intersections._sortPoint = point;
	if( !includeSolids && !includeTriggers ){
		return false;
	}
	var nearest = new Array();
	if( includeSolids && this.solids.length > 0 ){
		if( this.solids.length > 1 ){
			this.solids.sort( this.sortFunction );
		}
		nearest.push( this.solids[0] );
	}
	if( includeTriggers && this.triggers.length > 0 ){
		if( this.triggers.length > 1 ){
			this.triggers.sort( this.sortFunction );
		}
		nearest.push( this.triggers[0] );
	}
	if( nearest.length > 0 ){
		nearest.sort( this.sortFunction );
		return nearest[0];
	} else {
		return false;
	}
	
};
