SRJS.Physics.Polygon = function( fixed, trigger ){

	this.edges = new Array();
	this.fixed = fixed;
	this.trigger = trigger;

};

SRJS.Physics.Polygon.prototype.addEdge = function( edge ){
	this.edges.push( edge );
};
