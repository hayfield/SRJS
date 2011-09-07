SRJS.DebugCanvas = function( environment ){
	
	this.environment = environment;
	
	var canvas = document.createElement('canvas');
	this.canvas = canvas;
	this.canvas.width = SRJS.physicsDimension;
	this.canvas.height = SRJS.physicsDimension;
	document.body.appendChild( this.canvas );
	this.context = this.canvas.getContext('2d');
	
	this.draw = function(){
		var drawLine = function( start, end, ctx ){
			ctx.beginPath();
			ctx.moveTo( start.x, start.y );
			ctx.lineTo( end.x, end.y );
			ctx.stroke();
		};
		
		var drawPolygon = function( polygon, ctx ){
			var e, edge, start, end;
			e = 0;
			while( e < polygon.edges.length ){
				edge = polygon.edges[e];
				start = edge.start.toPhysicsCanvasCoords();
				end = edge.end.toPhysicsCanvasCoords();
				
				drawLine( start, end, ctx );
				
				e++;
			}
		};
		
		var ctx = this.context,
			p, polygon, i, b, f, ray;
		
		ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		p = 0;
		// draw the various bits of geometry on the canvas
		while( p < this.environment.polygons.length ){
			polygon = this.environment.polygons[p];

			// in different colours depending on its status
			if( polygon.fixed && !polygon.trigger ){
				ctx.strokeStyle = '#000';
			} else if( polygon.fixed && polygon.trigger ){
				ctx.strokeStyle = '#00F';
			} else if( !polygon.fixed && !polygon.trigger ){
				ctx.strokeStyle = '#0F0';
			} else {
				ctx.strokeStyle = '#FFF';
			}
			
			drawPolygon( polygon, ctx );
			
			p++;
		}
		// draw the bump sensors
		b = 0;
		while( b < this.environment.bumpSensors.length ){
			polygon = this.environment.bumpSensors[b].rect;
			
			if( this.environment.bumpSensors[b].d ){
				ctx.strokeStyle = '#000';
			} else {
				ctx.strokeStyle = '#FFF';
			}
			
			drawPolygon( polygon, ctx );
			
			b++;
		}
		// draw the range finders
		f = 0;
		while( f < this.environment.rangeFinders.length ){
			polygon = this.environment.rangeFinders[f].ray;
			ray = polygon.edges[0];
			ctx.strokeStyle = '#FF0';
			
			drawLine( ray.start.toPhysicsCanvasCoords(), polygon.nearestIntersection.toPhysicsCanvasCoords(), ctx );

			var intersection = polygon.nearestIntersection.toPhysicsCanvasCoords();
			ctx.fillStyle = '#FF0';
			ctx.fillRect( intersection.x, intersection.y, 5, 5 );
			
			f++;
		}
		
		// draw solid intersections
		ctx.fillStyle = '#FFF';
		i = 0;
		while( i < SRJS.intersections.solids.length ){
			var intersection = SRJS.intersections.solids[i].toPhysicsCanvasCoords();
			ctx.fillRect( intersection.x, intersection.y, 7, 7 );
			i++;
		}
		// and trigger ones
		ctx.fillStyle = '#F0F';
		i = 0;
		while( i < SRJS.intersections.triggers.length ){
			var intersection = SRJS.intersections.triggers[i].toPhysicsCanvasCoords();
			ctx.fillRect( intersection.x, intersection.y, 5, 5 );
			i++;
		}
		
	};
	
	this.update = function(){
		this.draw();
	};
	
};
