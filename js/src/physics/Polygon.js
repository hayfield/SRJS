SRJS.Physics.Polygon = new function( fixed, trigger ){

	this.edges = new Array();
	this.fixed = fixed;
	this.trigger = trigger;

};

SRJS.Physics.Polygon.prototype.addLine( line ){
	this.edges.push( line );
};
