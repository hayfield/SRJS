SRJS.Physics.Environment = function(){
	
	this.polygons = new Array();
	this.intersections = new Array();
	
	var canvas = document.createElement('canvas');
	this.canvas = canvas;
	this.canvas.width = 400;
	this.canvas.height = 400;
	document.body.appendChild( this.canvas );
	this.context = this.canvas.getContext('2d');
	
	this.draw = function(){
		var ctx = this.context;
		var colors = ['yellow', 'blue', 'black', 'white'];
		if( count < 5 ){
			console.log('drawing', ctx, this.polygons[0].edges);
		}
		
		ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		var p, e, polygon, edge;
		p = 0;
		//ctx.clearRect( 0, 0, 800, 800 );
		while( p < this.polygons.length ){
			polygon = this.polygons[p];			
			e = 0;
			while( e < polygon.edges.length ){
				edge = polygon.edges[e];
				
				ctx.beginPath();
				ctx.strokeStyle = colors[ e % 4 ];
				if( count < 15 ){
					count++;
					console.log( polygon, edge.start.x, edge.start.y, edge.end.x, edge.end.y, e, e % 4 );
				}
				ctx.moveTo( edge.start.x, edge.start.y );
				ctx.lineTo( edge.end.x, edge.end.y );
				ctx.stroke();
				e++;
			}
			
			
			p++;
		}
		
	};
	
};

var count = 0;

SRJS.Physics.Environment.prototype.addPolygon = function( polygon ){
	this.polygons.push( polygon );
};
