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
		var p, e, polygon, edge, start, end, i;
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
				ctx.moveTo( start.x, start.y );
				ctx.lineTo( end.x, end.y );
				ctx.stroke();
				
				e++;
			}
			
			p++;
		}
		
		ctx.fillStyle = '#FFF';
		i = 0;
		while( i < SRJS.intersections.solids.length ){
			var intersection = SRJS.intersections.solids[i].toPhysicsCanvasCoords();
			ctx.fillRect( intersection.x, intersection.y, 7, 7 );
			
			i++;
		}
		
	};
	
	this.update = function(){
		var p, e, polygon, edge, robot;
		p = 0;
		while( p < this.polygons.length ){
			polygon = this.polygons[p];
			
			if( !polygon.fixed && polygon.object instanceof SRJS.Robot ){
				this.updateRobot( polygon );
			}
			
			p++;
		}
	};
	
	this.updateRobot = function( polygon ){
		var robot = polygon.object;
				
		// work out how long since the last movement
		var elapsed = (Date.now() - robot.lastUpdate) / 1000;
		robot.lastUpdate = Date.now();
		
		// move each wheel forward
		var left = robot.speed * robot.motor[0].target * elapsed;
		var right = robot.speed * robot.motor[1].target * elapsed;
		
		// work out the angle between the two wheels
		var opposite = Math.max(left, right) - Math.min(left, right);
		var adjacent = 50;
		var angle = Math.atan( opposite / adjacent );
		
		if( robot.motor[0].target > robot.motor[1].target ){
			angle = -angle;
		}
		
		// move to the end of the line with the wheel that moved the shortest distance				
		var distance = -Math.min( left, right );
		
		this.moveRobot( polygon, distance, angle );
		
		if( polygon.hasIntersections( this.polygons ) ){
			// move it back to where it was (ish - the order isn't reversed)
			this.moveRobot( polygon, -distance, -angle );
		}
	};
	
	this.moveRobot = function( polygon, distance, angle ){
		var robot = polygon.object;
		var axis = robot.rotation.y;
		
		polygon.translate( distance, axis );
		robot.moveForward( distance );
		
		polygon.rotateAroundPoint( new SRJS.Vector2( robot.position.x, robot.position.z ), angle );
		robot.rotate( angle );
	};
	
};

SRJS.Physics.Environment.prototype.addPolygon = function( polygon ){
	if( SRJS.addPhysics ){
		this.polygons.push( polygon );
	}
};
