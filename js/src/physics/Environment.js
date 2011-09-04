SRJS.Physics.Environment = function(){
	
	this.polygons = new Array();
	this.bumpSensors = new Array();
	this.rangeFinders = new Array();
	
	this.intersections = new Array();
	
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
		
		var ctx = this.context;
		
		ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		var p, e, polygon, edge, start, end, i, b, f;
		p = 0;
		// draw the various bits of geometry on the canvas
		while( p < this.polygons.length ){
			polygon = this.polygons[p];

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
		while( b < this.bumpSensors.length ){
			polygon = this.bumpSensors[b].rect;
			
			if( this.bumpSensors[b].d ){
				ctx.strokeStyle = '#000';
			} else {
				ctx.strokeStyle = '#FFF';
			}
			
			drawPolygon( polygon, ctx );
			
			b++;
		}
		// draw the range finders
		f = 0;
		while( f < this.rangeFinders.length ){
			polygon = this.rangeFinders[f].ray;
			ray = polygon.edges[0];
			ctx.strokeStyle = '#FF0';
			
			drawLine( ray.start.toPhysicsCanvasCoords(), polygon.nearestIntersection.toPhysicsCanvasCoords(), ctx );
			//drawPolygon( polygon, ctx );
			
			//var intersection = polygon.intersectionPoint;
			//if( intersection ){
			var intersection = polygon.nearestIntersection.toPhysicsCanvasCoords();
			ctx.fillRect( intersection.x, intersection.y, 5, 5 );

			//}
			
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
		var p, e, polygon, edge, robot;
		SRJS.intersections.clear();
		
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
		
		var i = 0;
		while( i < robot.io.rangeFinder.length ){
			robot.io.rangeFinder[i].ray.intersections.clear();
			i++;
		}
				
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
		
		// update the bump sensors
		var s = 0;
		while( s < robot.io.bumpSensor.length ){
			var poly = robot.io.bumpSensor[s].rect;
			if( poly.hasIntersections( this.polygons ) ){
				robot.io.bumpSensor[s].d = true;
			} else {
				robot.io.bumpSensor[s].d = false;
			}
			s++;
		}
		
		// update the range finders
		var f = 0;
		var rayObj, ray, intersectionPoint;
		while( f < robot.io.rangeFinder.length ){
			var rayObj = robot.io.rangeFinder[f].ray;
			ray = rayObj.edges[0];
			rayObj.hasIntersections( this.polygons );
			rayObj.nearestIntersection = rayObj.intersections.nearestTo( rayObj.edges[0].start, true, false );
			if( !rayObj.nearestIntersection ){
				rayObj.nearestIntersection = rayObj.edges[0].end;
			}
			//intersectionPoint = ray.nearestIntersection( this.polygons );
			//rayObj.intersectionPoint = intersectionPoint;
			
			f++;
		}
	};
	
	this.moveRobot = function( polygon, distance, angle ){
		var robot = polygon.object;
		var axis = robot.rotation.y;
		// move robot
		polygon.translate( distance, axis );
		robot.moveForward( distance );
		
		polygon.rotateAroundPoint( new SRJS.Vector2( robot.position.x, robot.position.z ), angle );
		robot.rotate( angle );
		
		// move bump sensors
		var s = 0;
		while( s < robot.io.bumpSensor.length ){
			var poly = robot.io.bumpSensor[s].rect;
			poly.translate( distance, axis );
			poly.rotateAroundPoint( new SRJS.Vector2( robot.position.x, robot.position.z ), angle );
			s++;
		}
		
		// move range finders
		var f = 0;
		while( f < robot.io.rangeFinder.length ){
			var poly = robot.io.rangeFinder[f].ray;
			poly.translate( distance, axis );
			poly.rotateAroundPoint( new SRJS.Vector2( robot.position.x, robot.position.z ), angle );
			f++;
		}
	};
	
};

SRJS.Physics.Environment.prototype.addPolygon = function( polygon ){
	if( SRJS.addPhysics ){
		this.polygons.push( polygon );
	}
};

SRJS.Physics.Environment.prototype.addBumpSensor = function( polygon ){
	if( SRJS.addPhysics ){
		this.bumpSensors.push( polygon );
	}
};

SRJS.Physics.Environment.prototype.addRangeFinder = function( polygon ){
	if( SRJS.addPhysics ){
		this.rangeFinders.push( polygon );
	}
};
