SRJS.Physics.Intersections = function(){
	
	Array.call( this );
	
	this.solids = new Array();
	this.triggers = new Array();
	
};

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
