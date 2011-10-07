SRJS.Physics.Environment = function(){
	
	this.polygons = new Array();
	this.bumpSensors = new Array();
	this.rangeFinders = new Array();
	
	this.intersections = new Array();
	
	this.canvas = new SRJS.DebugCanvas( this );
	
	this.update = function(){
		var p, polygon;
		SRJS.intersections.clear();
		
		p = 0;
		while( p < this.polygons.length ){
			polygon = this.polygons[p];
			
			if( !polygon.fixed && polygon.object instanceof SRJS.Robot ){
				this.updateRobot( polygon );
			}
			
			p++;
		}
		
		this.canvas.update();
	};
	
	this.updateRobot = function( polygon ){
		var robot = polygon.object,
			i = 0,
			elapsed, left, right, opposite, adjacent, angle, distance,
			s,
			f, rayObj, ray;
		
		while( i < robot.io.rangeFinder.length ){
			robot.io.rangeFinder[i].ray.intersections.clear();
			i++;
		}
				
		// work out how long since the last movement
		elapsed = (Date.now() - robot.lastUpdate) / 1000;
		robot.lastUpdate = Date.now();
		
		// move each wheel forward
		left = robot.speed * robot.motor[0].target * elapsed;
		right = robot.speed * robot.motor[1].target * elapsed;
		
		// work out the angle between the two wheels
		opposite = Math.max(left, right) - Math.min(left, right);
		adjacent = 50;
		angle = Math.atan( opposite / adjacent );
		
		if( robot.motor[0].target > robot.motor[1].target ){
			angle = -angle;
		}
		
		// move to the end of the line with the wheel that moved the shortest distance				
		distance = -Math.min( left, right );
		
		this.moveRobot( polygon, distance, angle );
		
		if( polygon.hasIntersections( this.polygons ) ){
			// move it back to where it was (ish - the order isn't reversed)
			this.moveRobot( polygon, -distance, -angle );
		}
		
		// update the bump sensors
		s = 0;
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
		f = 0;
		while( f < robot.io.rangeFinder.length ){
			rayObj = robot.io.rangeFinder[f].ray;
			ray = rayObj.edges[0];
			rayObj.hasIntersections( this.polygons );
			rayObj.nearestIntersection = rayObj.intersections.nearestTo( rayObj.edges[0].start, true, false );
			if( !rayObj.nearestIntersection ){
				rayObj.nearestIntersection = rayObj.edges[0].end;
			}
			
			f++;
		}
	};
	
	this.moveRobot = function( polygon, distance, angle ){
		var robot = polygon.object,
			axis = robot.rotation.y,
			s, f, poly;

		// move robot
		polygon.translate( distance, axis );
		robot.moveForward( distance );
		
		polygon.rotateAroundPoint( new SRJS.Vector2( robot.position.x, robot.position.z ), angle );
		robot.rotate( angle );
		
		// move bump sensors
		s = 0;
		while( s < robot.io.bumpSensor.length ){
			poly = robot.io.bumpSensor[s].rect;
			poly.translate( distance, axis );
			poly.rotateAroundPoint( new SRJS.Vector2( robot.position.x, robot.position.z ), angle );
			s++;
		}
		
		// move range finders
		f = 0;
		while( f < robot.io.rangeFinder.length ){
			poly = robot.io.rangeFinder[f].ray;
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

SRJS.Physics.Environment.prototype.removePolygon = function( object ){
	var p = 0;
	while( p < this.polygons.length ){
		if( this.polygons[p].object === object ){
            if( this.polygons[p].object.marker instanceof SRJS.Marker ){
                SRJS.RemoveMarker( this.polygons[p].object.marker.code );
            }
			this.polygons.splice( p, 1 );
			return;
		}
		p++;
	}
};
