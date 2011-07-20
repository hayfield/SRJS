SRJS.Physics.Polygon = new function( fixed ){

	this.edges = new Array();
	this.fixed = fixed;

};

SRJS.Physics.Polygon.prototype.addLine( line ){
	this.edges.push( line );
};
