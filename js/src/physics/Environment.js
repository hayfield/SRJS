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
			this.context.beginPath();
			
			for( edge in polygon.edges ){
				this.context.moveTo( edge.start.x, edge.start.y );
				this.context.lineTo( edge.end.x, edge.end.y );
			}
			this.context.stroke();
		}
	};
	
};

SRJS.Physics.Environment.prototype.addPolygon = function( polygon ){
	this.polygons.push( polygon );
};
