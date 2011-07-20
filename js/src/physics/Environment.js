SRJS.Physics.Environment = function(){
	
	this.polygons = new Array();
	this.intersections = new Array();
	
	var canvas = document.createElement('canvas');
	this.canvas = canvas;
	this.canvas.width = SRJS.CURRENT_ARENA.renderer.domElement.width;
	this.canvas.height = SRJS.CURRENT_ARENA.renderer.domElement.height;
	document.body.appendChild( this.canvas );
	this.context = this.canvas.getContext('2d');
	
	this.drawToCanvas = function(){
		for( polygon in this.polygons ){
			for( edge in polygon.edges ){
				
			}
		}
	};
	
};

SRJS.Physics.Environment.prototype.addPolygon = function( polygon ){
	this.polygons.push( polygon );
};
