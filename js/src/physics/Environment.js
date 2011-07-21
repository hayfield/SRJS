SRJS.Physics.Environment = function(){
	
	this.polygons = new Array();
	this.intersections = new Array();
	
	var canvas = document.createElement('canvas');
	this.canvas = canvas;
	this.canvas.width = SRJS.physicsDimension;
	this.canvas.height = SRJS.physicsDimension;
	document.body.appendChild( this.canvas );
	this.context = this.canvas.getContext('2d');
	
	this.draw = function(){
		var ctx = this.context;
		
		ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		var p, e, polygon, edge, start, end;
		p = 0;
		while( p < this.polygons.length ){
			polygon = this.polygons[p];	

			if( polygon.fixed && !polygon.trigger ){
				ctx.strokeStyle = '#000';
			} else if( polygon.fixed && polygon.trigger ){
				ctx.strokeStyle = '#00F';
			} else if( !polygon.fixed && !polygon.trigger ){
				ctx.strokeStyle = '#0F0';
			} else {
				ctx.strokeStyle = '#FFF';
			}
			
			e = 0;
			while( e < polygon.edges.length ){
				edge = polygon.edges[e];
				start = edge.start.toPhysicsCanvasCoords();
				end = edge.end.toPhysicsCanvasCoords();
				
				ctx.beginPath();
				/*if( count < 15 ){
					count++;
					console.log( polygon, start.x, start.y, end.x, end.y, e, e % 4 );
				}*/
				ctx.moveTo( start.x, start.y );
				ctx.lineTo( end.x, end.y );
				ctx.stroke();
				
				e++;
			}
			
			p++;
		}
		
	};
	
};

var count = 0;

SRJS.Physics.Environment.prototype.addPolygon = function( polygon ){
	if( SRJS.addPhysics ){
		this.polygons.push( polygon );
	}
};
