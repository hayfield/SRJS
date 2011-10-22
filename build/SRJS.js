// REVISION: 4.1319279834.48
// FILE: SRJS.js
var SRJS = SRJS || {};

// FILE: core/Settings.js
SRJS.floatyCam = false;
SRJS.rendererDimension = 200;
SRJS.addPhysics = true;
SRJS.debugCanvasDimension = 800;
SRJS.displayStats = true;
SRJS.robotVision = false;
SRJS.bumpSensorsPerRobot = 16;
SRJS.rangeFindersPerRobot = 4;
SRJS.fov = 50;

// FILE: core/Utils.js
SRJS.isZero = function( value ){
	return Math.abs( value ) < 0.00000001;
};

SRJS.invokeRepeating = function( callback, initialDelay, repeatRate ){
	repeatRate = repeatRate || initialDelay;
	if( typeof callback !== 'function' || typeof initialDelay !== 'number' ){
		console.error('SRJS.invokeRepeating(callback, initialDelay[, repeatRate]) takes two parameters, plus an optionsal third.\n',
						'The first is the function which is to be repeated.\n',
						'The second is the delay before the function is called in milliseconds.\n',
						'The third is how often the function should be called after the initial delay.',
						'If not set, it defaults to the value given to initialDelay.\n\n',
						'The following parameters were provided:', arguments);
	} else {
		var repeating = function(){
			callback();
			window.setTimeout( repeating, repeatRate );
		};
		window.setTimeout( repeating, initialDelay );
	}
};

SRJS.CreateMarker = function( object, code, type ){
	var marker = new SRJS.Marker( object, code, type );
	object.marker = marker;
	SRJS.markers.push( marker );
};

SRJS.RemoveMarker = function( code ){
    var m = 0,
        removed = false;
    while( m < SRJS.markers.length && !removed ){
        if( SRJS.markers[m].code === code ){
            SRJS.markers.splice(m, 1);
            removed = true;
        }
        m++;
    }
};

SRJS.radToDeg = function( radians ){
	return radians / Math.PI * 180;
};

/*
	http://stackoverflow.com/questions/1759987/detect-variable-change-in-javascript/1760159#1760159
	https://gist.github.com/175649
	
	Seems to cause a couple of problems with Three.js when modifying Object.prototype.
	Need to manually add to the objects with properties that can be watched.
*/
SRJS.watch = function( prop, handler ){
	var thisReference = this;
	if( prop.indexOf('.') !== -1 ){
		var propertyArray = prop.split('.');
		prop = propertyArray.pop();
		thisReference = eval(propertyArray.join('.'));
	}
	var val = thisReference[prop],
	getter = function () {
			return val;
	},
	setter = function (newval) {
			return val = handler.call(thisReference, prop, val, newval);
	};
	if (delete thisReference[prop]) { // can't watch constants
			if (Object.defineProperty) // ECMAScript 5
					Object.defineProperty(thisReference, prop, {
							get: getter,
							set: setter,
							configurable: true
					});
			else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
					Object.prototype.__defineGetter__.call(thisReference, prop, getter);
					Object.prototype.__defineSetter__.call(thisReference, prop, setter);
			}
	}
};

SRJS.unwatch = function( prop ){
	var thisReference = this;
	if( prop.indexOf('.') !== -1 ){
		var propertyArray = prop.split('.');
		prop = propertyArray.pop();
		thisReference = eval(propertyArray.join('.'));
	}
	
	var val = thisReference[prop];
	delete thisReference[prop]; // remove accessors
	thisReference[prop] = val;
};

// FILE: core/Vector2.js
SRJS.Vector2 = function( x, y ){
	
	// by creating it as an instanceof THREE.Vector2, the values will randomly change
	//THREE.Vector2.call( this, x, y );
	this.x = x;
	this.y = y;
	
};

//SRJS.Vector2.prototype = new THREE.Vector2();
//SRJS.Vector2.prototype.constructor = SRJS.Vector2;

SRJS.Vector2.prototype.toPhysicsCanvasCoords = function(){
	return new SRJS.Vector2( this.x * (SRJS.debugCanvasDimension / SRJS.CURRENT_ARENA.arenaDimension) + SRJS.debugCanvasDimension / 2,
							 this.y * (SRJS.debugCanvasDimension / SRJS.CURRENT_ARENA.arenaDimension) + SRJS.debugCanvasDimension / 2 );
};

SRJS.Vector2.prototype.rotateAroundPoint = function( point, theta ){
	if( theta !== 0 ){
		point = point || new SRJS.Vector2( 0, 0 );
		
		//var x, y, xBefore, c, s;
		var x = this.x,
		y = this.y,
		c = Math.cos( theta ),
		s = Math.sin( theta ),
		xBefore;
		
		// translate so the point to rotate around is the origin
		xBefore = x -= point.x;
		y -= point.y;
		
		// perform the rotation - http://en.wikipedia.org/wiki/Rotation_matrix
		c = SRJS.isZero( c ) ? 0 : c;
		s = SRJS.isZero( s ) ? 0 : s;
	
		x = (x * c) + (y * s);
		y = (xBefore * -s) + (y * c);
	
		// translate back to the original position
		x += point.x;
		y += point.y;
		
		this.x = x;
		this.y = y;
	}
};

SRJS.Vector2.prototype.translate = function( distance, theta ){
	var c = Math.cos( theta ), s = Math.sin( theta );
	
	this.x += distance * s;
	this.y += distance * c;
};

SRJS.Vector2.prototype.cross = function( other ){
	return (this.x * other.y) - (this.y * other.x);
};

SRJS.Vector2.prototype.dot = function( other ){
	return (this.x * other.x) + (this.y * other.y);
};

SRJS.Vector2.prototype.normalise = function(){
	return this.divideScalar( this.length() );
};

SRJS.Vector2.prototype.add = function( other ){
	return new SRJS.Vector2( this.x + other.x, this.y + other.y );
};

SRJS.Vector2.prototype.subtract = function( other ){
	return new SRJS.Vector2( this.x - other.x, this.y - other.y );
};

SRJS.Vector2.prototype.multiply = function( value ){
	return new SRJS.Vector2( this.x * value, this.y * value );
};

SRJS.Vector2.prototype.divideScalar = function( s ){
	return new SRJS.Vector2( this.x /= s, this.y /= s );
};

SRJS.Vector2.prototype.lengthSquared = function(){
	return this.x * this.x + this.y * this.y;
};

SRJS.Vector2.prototype.length = function(){
	return Math.sqrt( this.lengthSquared() );
};

SRJS.Vector2.prototype.distanceToSquared = function( other ){
	var dx = this.x - other.x, dy = this.y - other.y;
	return dx * dx + dy * dy;
};

SRJS.Vector2.prototype.distanceTo = function( other ){
	return Math.sqrt( this.distanceToSquared( other ) );
};

SRJS.Vector2.prototype.angleTo = function( other ){
	return Math.acos( this.dot( other ) / (this.length() * other.length()) );
};

// FILE: core/Init.js
SRJS.Init = function( year ){
	
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	SRJS.intersections = new SRJS.Physics.Intersections();
	SRJS.phys = new SRJS.Physics.Environment();
	SRJS.markers = new Array();
	
	if( year === 2011 ){
		var bob = new SRJS.Arena2011();
	} else {
		var bob = new SRJS.Arena2012();
	}
	
};

// FILE: physics/Physics.js
SRJS.Physics = SRJS.Physics || {};

// FILE: physics/Intersections.js
SRJS.Physics.Intersections = function(){
	
	Array.call( this );
	
	this.solids = new Array();
	this.triggers = new Array();
	
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort
	this.sortFunction = function( a, b ){
		return a.distanceTo( SRJS.Physics.Intersections._sortPoint ) - b.distanceTo( SRJS.Physics.Intersections._sortPoint );
	};
	
};

SRJS.Physics.Intersections.prototype = new Array();
SRJS.Physics.Intersections.prototype.constructor = SRJS.Physics.Intersections;

SRJS.Physics.Intersections.prototype.push = function( location, trigger ){
	if( trigger ){
		this.triggers.push( location );
	} else {
		this.solids.push( location );
	}
};

SRJS.Physics.Intersections.prototype.clear = function(){
	this.solids.length = 0;
	this.triggers.length = 0;
};

SRJS.Physics.Intersections.prototype.nearestTo = function( point, includeSolids, includeTriggers ){

	SRJS.Physics.Intersections._sortPoint = point;
	if( !includeSolids && !includeTriggers ){
		return false;
	}
	
	var nearest = new Array();
	if( includeSolids && this.solids.length > 0 ){
		if( this.solids.length > 1 ){
			this.solids.sort( this.sortFunction );
		}
		nearest.push( this.solids[0] );
	}
	if( includeTriggers && this.triggers.length > 0 ){
		if( this.triggers.length > 1 ){
			this.triggers.sort( this.sortFunction );
		}
		nearest.push( this.triggers[0] );
	}
	
	if( nearest.length > 0 ){
		nearest.sort( this.sortFunction );
		return nearest[0];
	} else {
		return false;
	}
	
};

// FILE: physics/Edge.js
SRJS.Physics.Edge = function( start, end ){
	
	// start and end positions of edge are of type SRJS.Vector2
	this.start = start;
	this.end = end;
	
	this._lengthGetter = function(){
		return (this.start.addSelf( this.end )).length;
	};
	
	Object.defineProperty(this, 'length', {
		get: this._lengthGetter
	});
	
	this._normalGetter = function(){
		return new SRJS.Vector2( -(this.end.y - this.start.y), (this.end.x - this.start.x) );
	};
	
	Object.defineProperty(this, 'normal', {
		get: this._normalGetter
	});
	
};

SRJS.Physics.Edge.prototype.rotateAroundPoint = function( point, theta ){
	this.start.rotateAroundPoint( point, theta );
	this.end.rotateAroundPoint( point, theta );
};

SRJS.Physics.Edge.prototype.translate = function( distance, theta ){
	this.start.translate( distance, theta );
	this.end.translate( distance, theta );
};

// http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
// or see Edge-README.txt
SRJS.Physics.Edge.prototype.intersects = function( other ){
	// collinear or never intersect
	if( this.movement().cross( other.movement() ) === 0 ){
		return false;
	}
	
	var distAlongThisLine = (other.start.subtract( this.start )).cross( other.movement() ) / 
								this.movement().cross( other.movement() ),
		distAlongOtherLine = (other.start.subtract( this.start )).cross( this.movement() ) /
								this.movement().cross( other.movement() );

	// not within the specified parts of the line
	if( distAlongThisLine < 0 || distAlongThisLine > 1
		|| distAlongOtherLine < 0 || distAlongOtherLine > 1 ){
		return false;
	} else { // intersect
		return this.start.add( this.movement().multiply( distAlongThisLine ) );
	}
	
};

SRJS.Physics.Edge.prototype.movement = function(){
	return new SRJS.Vector2( this.end.x - this.start.x, this.end.y - this.start.y );
};

// FILE: physics/Polygon.js
SRJS.Physics.Polygon = function( fixed, trigger, object ){

	this.edges = new Array();
	this.fixed = fixed;
	this.trigger = trigger;
	this.object = object;

};

SRJS.Physics.Polygon.prototype.rotateAroundPoint = function( point, theta ){
	var e = 0;
	while( e < this.edges.length ){
		this.edges[e].rotateAroundPoint( point, theta );
		e++;
	}
};

SRJS.Physics.Polygon.prototype.translate = function( distance, theta ){
	var e = 0;
	while( e < this.edges.length ){
		this.edges[e].translate( distance, theta );
		e++;
	}
};

SRJS.Physics.Polygon.prototype.addEdge = function( edge ){
	this.edges.push( edge );
};

SRJS.Physics.Polygon.prototype.hasIntersections = function( polygons, pushableCheck ){
	var p, solidIntersectionsStart, intersects;
	solidIntersectionsStart = SRJS.intersections.solids.length;
	intersects = false;
	
	p = 0;
	while( p < polygons.length ){
		if( polygons[p] !== this ){
			if( !(this.object instanceof SRJS.Robot.BumpSensor) ||
				((this.object instanceof SRJS.Robot.BumpSensor) && !(polygons[p].object instanceof SRJS.Robot) &&
					!(polygons[p].object instanceof SRJS.Trigger)) ){
				if( this.intersectsWith( polygons[p], pushableCheck ) ){
					intersects = true;
				}
			}
		}
		p++;
	}
	
	if( this.object instanceof SRJS.Robot.BumpSensor ){
		return intersects;
	} else {
		return SRJS.intersections.solids.length - solidIntersectionsStart;
	}

};

SRJS.Physics.Polygon.prototype.intersectsWith = function( other, pushableCheck ){
	var e, o, intersects, intersection;
	
	if( other.object.heightOfBase > this.object.heightOfTop ||
			this.object.heightOfBase > other.object.heightOfTop ){
		return false;
	}
	
	if( pushableCheck && other.object instanceof SRJS.Robot ){
		return false;
	}
	
	// make robots push pushable objects
	if( !pushableCheck && other.object instanceof SRJS.Pushable && this.object instanceof SRJS.Robot ){
		var result = this.SAT( other, false );
		if( result === null ) return false;
		result.separation = result.vector.multiply( result.distance );
		
		if( !other.hasIntersections( SRJS.phys.polygons, true ) ){
			other.translate( result.separation.x, Math.PI * 0.5 );
			other.translate( result.separation.y, 0 );
			other.object.position.x += result.separation.x;
			other.object.position.z += result.separation.y;
			return false;
		} else {
			return true;
		}
	}
	
	intersects = false;
	e = 0;
	while( e < this.edges.length ){
	
		o = 0;
		while( o < other.edges.length ){
			intersection = this.edges[e].intersects( other.edges[o] );
			if( intersection ){
				if( this.object instanceof SRJS.Robot.BumpSensor ){
					return true;
				} else if( this.object instanceof SRJS.Robot.RangeFinder ){
					if( other.object !== this.object.robot ){
						this.object.ray.intersections.push( intersection, other.trigger );
						intersects = true;
					}
				} else {
					SRJS.intersections.push( this.edges[e].intersects( other.edges[o] ), other.trigger );
					intersects = true;
				}
			}
			o++;
		}
		e++;
	}
	
	if( intersects ){
		if( this.object instanceof SRJS.Robot && other.object instanceof SRJS.Trigger ){
			other.object.intersectingRobots.push( this.object.ID );
		}
	}
	
	return intersects;
};

// http://www.sevenson.com.au/actionscript/sat/
// http://content.gpwiki.org/index.php/VB:Tutorials:Building_A_Physics_Engine:Basic_Intersection_Detection
// http://en.wikipedia.org/wiki/Separating_axis_theorem
SRJS.Physics.Polygon.prototype.SAT = function( other, flip ){
	var e, p, edges,
		projectionAxis,
		minThis, maxThis, minOther, maxOther,
		dot,
		distMin, distMinAbs, shortestDist, result,
		thisPosition, otherPosition, offset, offsetShift;
	
	edges = this.edges.concat( other.edges );
	minThis = Number.MAX_VALUE;
	minOther = Number.MAX_VALUE;
	maxThis = Number.MIN_VALUE;
	maxOther = Number.MIN_VALUE;
	shortestDist = Number.MAX_VALUE;
	result = {};
	thisPosition = new SRJS.Vector2( this.object.position.x, this.object.position.z );
	otherPosition = new SRJS.Vector2( other.object.position.x, other.object.position.z );
	offset = new SRJS.Vector2( thisPosition.x - otherPosition.x, thisPosition.y - otherPosition.y );
	
	// loop through the edges on the polygons
	for( e = 0; e < edges.length; e++ ){
		// find the normal to the edge (to project points onto)
		projectionAxis = edges[e].normal.normalise();
		
		// project both of the polygons
		// loop through all the edges. Each edges has 2 points, so projecting twice as many as needed
		// this polygon
		for( p = 0; p < this.edges.length; p++ ){
			dot = projectionAxis.dot( this.edges[p].start.subtract( thisPosition ) );
			if( dot < minThis ) minThis = dot;
			if( dot > maxThis ) maxThis = dot;
			
			dot = projectionAxis.dot( this.edges[p].end.subtract( thisPosition ) );
			if( dot < minThis ) minThis = dot;
			if( dot > maxThis ) maxThis = dot;
		}
		// other polygon
		for( p = 0; p < other.edges.length; p++ ){
			dot = projectionAxis.dot( other.edges[p].start.subtract( otherPosition ) );
			if( dot < minOther ) minOther = dot;
			if( dot > maxOther ) maxOther = dot;
			
			dot = projectionAxis.dot( other.edges[p].end.subtract( otherPosition ) );
			if( dot < minOther ) minOther = dot;
			if( dot > maxOther ) maxOther = dot;
		}
		
		// shift the points of one of them by some sort of offset
		offsetShift = offset.dot( projectionAxis );
		minThis += offsetShift;
		maxThis += offsetShift;
		
		// test for intersections
		if( (minThis - maxOther) > 0 || (minOther - maxThis) > 0 ){
			// gap found
			return null;
		}
		
		// find the distance that they need moving to separate
		//distMin = (maxOther - minThis) * -1; // this should work
		//distMin = Math.abs(maxOther - minThis) > 5 ? (minOther - maxThis) * -1 : (maxOther - minThis) * -1;
		distMin = e >= this.edges.length ? (maxOther - minThis) * -1 : (minOther - maxThis) * -1;
		if( flip ) distMin *= -1;
		distMinAbs = Math.abs( distMin );
		if( distMinAbs < shortestDist ){
			result.distance = distMin;
			result.vector = projectionAxis;
			shortestDist = distMinAbs;
		}
	}
	
	// if not yet returned, no gap was found
	return result;
};

// FILE: physics/Rectangle.js
SRJS.Physics.Rectangle = function( fixed, trigger, dimension, position, rotation, object ){
	
	SRJS.Physics.Polygon.call( this, fixed, trigger, object );

	rotation = rotation || 0;
	
	var topLeft = new SRJS.Vector2( position.x - (dimension.x / 2),
									 position.y - (dimension.y / 2) ),
		topRight = new SRJS.Vector2( position.x + (dimension.x / 2),
									  position.y - (dimension.y / 2) ),
		bottomLeft = new SRJS.Vector2( position.x - (dimension.x / 2),
										position.y + (dimension.y / 2) ),
		bottomRight = new SRJS.Vector2( position.x + (dimension.x / 2),
										 position.y + (dimension.y / 2) );
	
	topLeft.rotateAroundPoint( position, rotation );
	topRight.rotateAroundPoint( position, rotation );
	bottomLeft.rotateAroundPoint( position, rotation );
	bottomRight.rotateAroundPoint( position, rotation );
	
	// top
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(topLeft.x, topLeft.y),
										 new SRJS.Vector2(topRight.x, topRight.y) ));
	// bottom
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(bottomLeft.x, bottomLeft.y),
										 new SRJS.Vector2(bottomRight.x, bottomRight.y) ));
	// left
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(topLeft.x, topLeft.y),
										 new SRJS.Vector2(bottomLeft.x, bottomLeft.y) ));
	// right
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(topRight.x, topRight.y),
										 new SRJS.Vector2(bottomRight.x, bottomRight.y) ));
	
};

SRJS.Physics.Rectangle.prototype = new SRJS.Physics.Polygon();
SRJS.Physics.Rectangle.prototype.constructor = SRJS.Physics.Rectangle;

// FILE: physics/Ray.js
SRJS.Physics.Ray = function( startPosition, rotation, object ){
	
	this.parent = object;

	SRJS.Physics.Polygon.call( this, false, true, object );

	rotation = rotation || 0;
	
	var length = 16777216; // make it long, so it'll hit into anything within the arena
	
	var endPosition = new SRJS.Vector2( startPosition.x, startPosition.y - length );
	endPosition.rotateAroundPoint( startPosition, rotation );
	
	// create the ray
	this.addEdge( new SRJS.Physics.Edge( new SRJS.Vector2(startPosition.x, startPosition.y),
										 new SRJS.Vector2(endPosition.x, endPosition.y) ) );
	
	this.intersections = new SRJS.Physics.Intersections();
	
	this.nearestIntersection = this.edges[0].end;
	
	this._distanceToIntersectionGetter = function(){
		return this.edges[0].start.distanceTo( this.nearestIntersection );
	};
	
	Object.defineProperty(this, 'distanceToIntersection', {
		get: this._distanceToIntersectionGetter
	});
	
};

SRJS.Physics.Ray.prototype = new SRJS.Physics.Polygon();
SRJS.Physics.Ray.prototype.constructor = SRJS.Physics.Ray;

// FILE: physics/Environment.js
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

// FILE: physics/DebugCanvas.js
SRJS.DebugCanvas = function( environment ){
	
	this.environment = environment;
	
	var canvas = document.createElement('canvas');
	this.canvas = canvas;
	this.canvas.width = SRJS.debugCanvasDimension;
	this.canvas.height = SRJS.debugCanvasDimension;
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

// FILE: arena/Arena.js
SRJS.Arena = function( args ){

	if( typeof args === 'undefined' ){
		
		this.scene = new THREE.Scene();
		this.init = function(){
			console.error('No arguments passed to SRJS.Arena()');
		};
		
	} else {
		
		SRJS.CURRENT_ARENA = this;
		
		this.physics = args.physics || new SRJS.Physics.Environment();
		this.arenaDimension = typeof args.arenaDimension != 'undefined' ? args.arenaDimension : 1;
		
		this.triggers = new Array();
		this.robots = new Array();
		this.robotStartPositions = args.robotStartPositions;
		this.robotStartRotations = args.robotStartRotations;
		// ensure the length of the rotation array is the same as the position one
		var r = this.robotStartRotations.length;
		while( r < this.robotStartPositions.length ){
			this.robotStartRotations.push( 0 );
			r++;
		}
		
		args.initScene();
		
		this.args = args;
		this.scene = args.scene || new THREE.Scene();
		
		this.visionVersion = typeof args.visionVersion != 'undefined' ? args.visionVersion : 2;
		
		this.renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer;
		this.renderer.setSize( SRJS.rendererDimension, SRJS.rendererDimension );
		document.body.appendChild( this.renderer.domElement );
		
		this.rendererContext = this.renderer.domElement.getContext('experimental-webgl');
		
		this.container = document.createElement('div');
		document.body.appendChild( this.container );
		
		this.camera = new THREE.QuakeCamera({
            fov: SRJS.fov,
            aspect: window.innerWidth / window.innerHeight,
            near: 1,
            far: 20000,
            constrainVertical: true,
            verticalMin: 1.1,
            verticalMax: 2.2,
            movementSpeed: 1000,
            lookSpeed: 0.125,
            noFly: false,
            lookVertical: true,
            autoForward: false
		});
		this.camera.position.y = 100;
		
		// don't always display the stats pane
		if( SRJS.displayStats ){
			this.stats = new Stats();
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.top = '0px';
			this.container.appendChild( this.stats.domElement );
		}
		
		this.animate = function(){
			var arena = SRJS.CURRENT_ARENA,
				robot;
			
			arena.physics.update();
			arena.callRobotTriggerEvents();
			
			robot = 0;
			while( robot < arena.robots.length ){
				arena.robots[robot].runFrame();
				robot++;
			}
			
			requestAnimationFrame( arena.animate );
			arena.render();
			
			if( SRJS.displayStats && arena.stats ){
				arena.stats.update();
			}
		};
		
		this.render = function(){
			var arena = SRJS.CURRENT_ARENA;
			
			if( SRJS.robotVision ){
				var robot = 0;
				while( robot < arena.robots.length ){
					arena.renderer.render( arena.scene, arena.robots[robot].camera );
					arena.robots[robot].vision.update( arena.renderer );
					
					robot++;
				}
			}
			
			arena.renderer.render( arena.scene, arena.camera );
		};
		
		SRJS.CURRENT_ARENA = this;
		
		this.animate();
	
	}
	
};

/*
	Takes only a single (optional) parameter.
	This can be either an instance of SRJS.Robot() or an args object to specify how a new robot should be created.
	If there is no parameter, a robot with default settings will be created.
*/
SRJS.Arena.prototype.addRobot = function( robot ){
	
	if( robot && !(robot instanceof SRJS.Robot) && typeof robot === 'object' ){
		var args = robot;
		robot = new SRJS.Robot( args );
	}
	
	this.robots[this.robots.length] = robot || new SRJS.Robot();
	this.robots[this.robots.length - 1].ID = this.robots.length;
	
	this.scene.addObject( this.robots[this.robots.length - 1] );
    SRJS.CreateMarker( this.robots[this.robots.length - 1], 28 + (this.robots.length - 1), SRJS.MARKER_ROBOT );
	
};

SRJS.Arena.prototype.getRobot = function( robotID ){
	var r = 0;
	while( r < this.robots.length ){
		if( this.robots[r].ID === robotID ){
			return this.robots[r];
		}
		
		r++;
	}
	
	return false;
};

SRJS.Arena.prototype.callRobotTriggerEvents = function(){

	var t, i, trigger;
	t = 0;
	while( t < this.triggers.length ){
		trigger = this.triggers[t];
		
		i = 0;
		while( i < trigger.previousIntersectingRobots.length ){
			if( trigger.intersectingRobots.indexOf( trigger.previousIntersectingRobots[i] ) !== -1 ){
				trigger.onRobotStay( trigger.previousIntersectingRobots[i] );
			} else if( trigger.intersectingRobots.indexOf( trigger.previousIntersectingRobots[i] ) === -1 ){
				trigger.onRobotExit( trigger.previousIntersectingRobots[i] );
			}
			
			i++;
		}
		
		i = 0;
		while( i < trigger.intersectingRobots.length ){
			if( trigger.previousIntersectingRobots.indexOf( trigger.intersectingRobots[i] ) === -1 ){
				trigger.onRobotEnter( trigger.intersectingRobots[i] );
			}
			
			i++;
		}
		trigger.previousIntersectingRobots = trigger.intersectingRobots;
		trigger.intersectingRobots = [];
		
		t++;
	}
	
};

// FILE: arena/Arena2011.js
SRJS.Arena2011 = function(){
	
	var args = {}, scene;

	args.initScene = function(){
		
        scene = new THREE.Scene();
		
		var i, ambient, directionalLight, pointLight;
		
		ambient = new THREE.AmbientLight( 0xffffff );
		scene.addLight( ambient );
 
		directionalLight = new THREE.DirectionalLight( 0xff0000 );
		directionalLight.position.y = 200;
		directionalLight.position.normalize();
		scene.addLight( directionalLight );
 
		pointLight = new THREE.PointLight( 0xff0000 );
		pointLight.position.y = 150;
		pointLight.position.x = -250;
		pointLight.position.z = -250;
		pointLight.intensity = 0.5;
		scene.addLight( pointLight );

		// floor
		scene.addObject( new SRJS.Wall( 800, 100, 800 ) );

		// 4 outer walls
		scene.addObject( new SRJS.Wall( 100, 60, 1000, new THREE.Vector3( 450, 80, 0 ) ) );
		scene.addObject( new SRJS.Wall( 100, 60, 1000, new THREE.Vector3( -450, 80, 0 ) ) );
		scene.addObject( new SRJS.Wall( 100, 60, 1000,
										new THREE.Vector3( 0, 80, -450 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		scene.addObject( new SRJS.Wall( 100, 60, 1000,
										new THREE.Vector3( 0, 80, 450 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		// eight inner walls
		// the large section
		// two long walls
		scene.addObject( new SRJS.Wall( 400, 20, 5,
										new THREE.Vector3( 0, 60, 197.5 )
									) );
		scene.addObject( new SRJS.Wall( 400, 20, 5,
										new THREE.Vector3( 197.5, 60, 0 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		// two short walls connecting the long ones
		scene.addObject( new SRJS.Wall( 100, 20, 5,
										new THREE.Vector3( 150, 60, -197.5 )
									) );
		scene.addObject( new SRJS.Wall( 100, 20, 5,
										new THREE.Vector3( -197.5, 60, 150 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		// diagonal wall to complete this section
		scene.addObject( new SRJS.Wall( 425, 20, 5,
										new THREE.Vector3( -48.1, 60, -48.1 ),
										new THREE.Vector3( 0, Math.PI / 4, 0 )
									) );
									
		// the smaller triangle
		// two straight walls
		scene.addObject( new SRJS.Wall( 200, 20, 5,
										new THREE.Vector3( -100, 60, -197.5 )
									) );
		scene.addObject( new SRJS.Wall( 200, 20, 5,
										new THREE.Vector3( -197.5, 60, -100 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		// the diagonal to close off this triangle
		scene.addObject( new SRJS.Wall( 276, 20, 5,
										new THREE.Vector3( -99.3, 60, -99.3 ),
										new THREE.Vector3( 0, Math.PI / 4, 0 )
									) );
		
		SRJS.addPhysics = false;
		
		// the blue blobs around the arena
		for( i = 0; i < 27; i++ ){
			// one long side
			scene.addObject( new SRJS.Cube( 4.9,
										new THREE.Vector3( 197.4 - i * 15, 52.45, 197.57 ),
										SRJS.Material.blue
									) );
			// the other long side
			scene.addObject( new SRJS.Cube( 4.9,
										new THREE.Vector3( 197.57, 52.45, -197.4 + i * 15 ),
										SRJS.Material.blue
									) );
			var height = i < 14 && i > 6 ? 47.57 : 52.45;
			// one broken side
			scene.addObject( new SRJS.Cube( 4.9,
										new THREE.Vector3( 197.4 - i * 15, height, -197.57 ),
										SRJS.Material.blue
									) );
			// the other broken side
			scene.addObject( new SRJS.Cube( 4.9,
										new THREE.Vector3( -197.57, height, 197.4 - i * 15 ),
										SRJS.Material.blue
									) );
		}
		
		SRJS.addPhysics = true;
		
		// add the quadrant triggers
		var quadrantTrigger = function( robotID ){
			var robot = SRJS.CURRENT_ARENA.getRobot( robotID );
			
			if( robot.lastEnteredTrigger !== this ){
				robot.gameScore += 2;
				if( robot.cansOnBoard ){
					robot.gameScore += robot.cansOnBoard;
				}
				robot.lastEnteredTrigger = this;
			}

		};
		scene.addObject( new SRJS.Trigger( 300, 100, 1,
										new THREE.Vector3( -300, 100, 300 ),
										new THREE.Vector3( 0, Math.PI / 4, 0 ),
										quadrantTrigger
									) );
		scene.addObject( new SRJS.Trigger( 300, 100, 1,
										new THREE.Vector3( -300, 100, -300 ),
										new THREE.Vector3( 0, -Math.PI / 4, 0 ),
										quadrantTrigger
									) );
		scene.addObject( new SRJS.Trigger( 300, 100, 1,
										new THREE.Vector3( 300, 100, 300 ),
										new THREE.Vector3( 0, -Math.PI / 4, 0 ),
										quadrantTrigger
									) );
		scene.addObject( new SRJS.Trigger( 300, 100, 1,
										new THREE.Vector3( 300, 100, -300 ),
										new THREE.Vector3( 0, Math.PI / 4, 0 ),
										quadrantTrigger
									) );

		this.scene = scene;
	};
	
	args.physics = SRJS.phys;
	
	args.arenaDimension = 800;
	
	args.robotStartPositions = [
									new SRJS.Vector2( 365, 365 ),
									new SRJS.Vector2( 365, -365 ),
									new SRJS.Vector2( -365, -365 ),
									new SRJS.Vector2( -365, 365 )
							   ];
	
	args.robotStartRotations = [ 0, Math.PI / 2, Math.PI, Math.PI * 1.5 ];
	
	args.visionVersion = 1;
	
	return new SRJS.Arena( args );
	
};

// FILE: arena/Arena2012.js
SRJS.Arena2012 = function(){
	
	var args = {}, scene;

	args.initScene = function(){
		
        scene = new THREE.Scene();
		
		var i, ambient, directionalLight, pointLight;
		
		ambient = new THREE.AmbientLight( 0xffffff );
		scene.addLight( ambient );
 
		directionalLight = new THREE.DirectionalLight( 0xff0000 );
		directionalLight.position.y = 200;
		directionalLight.position.normalize();
		scene.addLight( directionalLight );
 
		pointLight = new THREE.PointLight( 0xff0000 );
		pointLight.position.y = 150;
		pointLight.position.x = -250;
		pointLight.position.z = -250;
		pointLight.intensity = 0.5;
		scene.addLight( pointLight );

		// floor
		scene.addObject( new SRJS.Wall( 800, 100, 800 ) );

		// 4 outer walls
		scene.addObject( new SRJS.Wall( 100, 60, 1000, new THREE.Vector3( 450, 80, 0 ) ) );
		scene.addObject( new SRJS.Wall( 100, 60, 1000, new THREE.Vector3( -450, 80, 0 ) ) );
		scene.addObject( new SRJS.Wall( 100, 60, 1000,
										new THREE.Vector3( 0, 80, -450 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		scene.addObject( new SRJS.Wall( 100, 60, 1000,
										new THREE.Vector3( 0, 80, 450 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		
		// 4 inner walls (that robots can get under, but buckets can't)
		scene.addObject( new SRJS.Wall( 600, 20, 5,
										new THREE.Vector3( 0, 135, 297.5 )
									) );
		scene.addObject( new SRJS.Wall( 600, 20, 5,
										new THREE.Vector3( 297.5, 135, 0 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		scene.addObject( new SRJS.Wall( 600, 20, 5,
										new THREE.Vector3( 0, 135, -297.5 )
									) );
		scene.addObject( new SRJS.Wall( 600, 20, 5,
										new THREE.Vector3( -297.5, 135, 0 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		
        // the feet along the inner walls (2 per side) that the robots will drive into
        // bottom
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( 150, 87.5, 297.5 )
									) );
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( -150, 87.5, 297.5 )
									) );
        // top
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( 150, 87.5, -297.5 )
									) );
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( -150, 87.5, -297.5 )
									) );
        // left
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( -297.5, 87.5, 150 )
									) );
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( -297.5, 87.5, -150 )
									) );
        // right
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( 297.5, 87.5, 150 )
									) );
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( 297.5, 87.5, -150 )
									) );
        
        // add the markers around the edges of the arena
        // start in the top-right corner on thr right wall and work round clockwise
        var i, marker;
        for( i = 0; i < 7; i++ ){
            // right
            marker = new SRJS.Trigger( 1, 25, 25,
                                    new THREE.Vector3( 400, 67.5, -346 + i * (808/7) )
                                  );
            SRJS.CreateMarker( marker, i, SRJS.MARKER_ARENA );
            scene.addObject( marker );
            // bottom
            marker = new SRJS.Trigger( 25, 25, 1,
                                    new THREE.Vector3( 346 - i * (808/7), 67.5, 400 )
                                  );
            SRJS.CreateMarker( marker, i + 7, SRJS.MARKER_ARENA );
            scene.addObject( marker );
            // left
            marker = new SRJS.Trigger( 1, 25, 25,
                                    new THREE.Vector3( -400, 67.5, 346 - i * (808/7) )
                                  );
            SRJS.CreateMarker( marker, i + 14, SRJS.MARKER_ARENA );
            scene.addObject( marker );
            // top
            marker = new SRJS.Trigger( 25, 25, 1,
                                    new THREE.Vector3( -346 + i * (808/7), 67.5, -400 )
                                  );
            SRJS.CreateMarker( marker, i + 21, SRJS.MARKER_ARENA );
            scene.addObject( marker );
        }
        
		// add the boxes in the middle of the arena
		var box, boxAction, bucket;
		boxAction = function( robotID ){
			var robot = SRJS.CURRENT_ARENA.robots[robotID - 1];
			robot.gameSettings.carriedBoxes = typeof robot.gameSettings.carriedBoxes === 'undefined' ? 1 : robot.gameSettings.carriedBoxes + 1;
			SRJS.phys.removePolygon( this );
			scene.removeObject( this );
		};
		for( i = 0; i < 20; i++ ){
			box = new SRJS.Trigger( 11, 11, 11,
								new THREE.Vector3( Math.random() * 520 - 240, 55.5, Math.random() * 520 - 240 ),
								new THREE.Vector3( 0, 0, 0 ),
								boxAction
								);
			SRJS.CreateMarker( box, 32 + i, SRJS.MARKER_TOKEN );
			scene.addObject( box );
		}
		
		// add the buckets
		var bucketPositions = [
			new THREE.Vector3( 0, 100, 350 ),
			new THREE.Vector3( 350, 100, 0 ),
			new THREE.Vector3( 0, 100, -350 ),
			new THREE.Vector3( -350, 100, 0 )
		];
		for( i = 0; i < 4; i++ ){
			bucket = new SRJS.Pushable( 24.5, 100, 37.2,
										bucketPositions[i],
										new THREE.Vector3( 0, 0, 0 )
									);
			SRJS.CreateMarker( bucket, 72 + i, SRJS.MARKER_BUCKET );
			scene.addObject( bucket );
		}
		
		this.scene = scene;
	};
	
	args.physics = SRJS.phys;
	
	args.arenaDimension = 800;
	
	args.robotStartPositions = [
									new SRJS.Vector2( 100, 365 ),
									new SRJS.Vector2( 365, -100 ),
									new SRJS.Vector2( -100, -365 ),
									new SRJS.Vector2( -365, 100 )
							   ];
	
	args.robotStartRotations = [ 0, Math.PI / 2, Math.PI, Math.PI * 1.5 ];
	
	args.visionVersion = 2;
	
	return new SRJS.Arena( args );
	
};

// FILE: arena/Material.js
SRJS.Material = {
	
	white: new THREE.MeshPhongMaterial( { color: 0xffffff } ),
	red: new THREE.MeshPhongMaterial( { color: 0xff0000 } ),
	green: new THREE.MeshPhongMaterial( { color: 0x00ff00 } ),
	blue: new THREE.MeshPhongMaterial( { color: 0x0000ff } ),
	yellow: new THREE.MeshPhongMaterial( { color: 0xffff00 } ),
	black: new THREE.MeshPhongMaterial( { color: 0x000000 } )
	
};

// FILE: arena/Wall.js
SRJS.Wall = function( width, height, depth, position, rotation, material ){
if( arguments.length > 0 ){	// prevent the code being run on the constructor call from SRJS.Cube/Trigger
	var geometry = new THREE.CubeGeometry( width, height, depth ),
		materials = material || SRJS.Material.white;
	
	this.wallWidth = width;
	this.wallHeight = height;
	this.wallDepth = depth;
	
	THREE.Mesh.call( this, geometry, materials );
	
	this.position = position instanceof THREE.Vector3 ? position : this.position;
	this.rotation = rotation instanceof THREE.Vector3 ? rotation : this.rotation;
	
	SRJS.phys.addPolygon( new SRJS.Physics.Rectangle( !(this instanceof SRJS.Robot), this instanceof SRJS.Trigger,
														new SRJS.Vector2( width, depth ),
														new SRJS.Vector2( this.position.x, this.position.z ),
														this.rotation.y, this ));

	this._heightOfBaseGetter = function(){
		return this.position.y - this.wallHeight / 2;
	};
	
	Object.defineProperty(this, 'heightOfBase', {
		get: this._heightOfBaseGetter
	});
	
	this._heightOfTopGetter = function(){
		return this.position.y + this.wallHeight / 2;
	};
	
	Object.defineProperty(this, 'heightOfTop', {
		get: this._heightOfTopGetter
	});
}	
};

SRJS.Wall.prototype = new THREE.Mesh();
SRJS.Wall.prototype.constructor = SRJS.Wall;

// FILE: arena/Cube.js
SRJS.Cube = function( dimension, position, material ){
if( arguments.length > 0 ){ // prevent the code being run on the constructor call from SRJS.Robot

	SRJS.Wall.call( this, dimension, dimension, dimension,
						position || new THREE.Vector3(),
						new THREE.Vector3(),
						material
					);
}
};

SRJS.Cube.prototype = new SRJS.Wall();
SRJS.Cube.prototype.constructor = SRJS.Cube;

// FILE: arena/Trigger.js
SRJS.Trigger = function( width, height, depth, position, rotation, action ){
	
	SRJS.Wall.call( this, width, height, depth, position, rotation, SRJS.Material.yellow );
	
	this.onRobotEnter = action || function( robotID ){ /*console.log('enter', robotID);*/ };
	//this.onRobotEnter = function( robotID ){ console.log('enter', robotID); };
	this.onRobotStay = function( robotID ){ /*console.log('stay', robotID);*/ };
	this.onRobotExit = function( robotID ){ /*console.log('exit', robotID);*/ };
	
	this.intersectingRobots = new Array();
	this.previousIntersectingRobots = new Array();
	
	SRJS.CURRENT_ARENA.triggers.push( this );

};

SRJS.Trigger.prototype = new SRJS.Wall();
SRJS.Trigger.prototype.constructor = SRJS.Trigger;

// FILE: arena/Pushable.js
SRJS.Pushable = function( width, height, depth, position, rotation ){
	
	SRJS.Wall.call( this, width, height, depth, position, rotation, SRJS.Material.blue );

};

SRJS.Pushable.prototype = new SRJS.Wall();
SRJS.Pushable.prototype.constructor = SRJS.Pushable;

// FILE: arena/Marker.js
SRJS.Marker = function( parentObject, code, type ){
    
	this.object = parentObject;
	
    this.info = new SRJS.MarkerInfo( code, type );
	this.centre = new SRJS.MarkerPoint();
    this.orientation = new SRJS.MarkerOrientation();
    this.res = new SRJS.Vector2(0, 0);
    
    this.timestamp = Date.now();
	
	this.update = function( source, width, height ){
        this.timestamp = Date.now();
		this.orientation._update( this._updateOrientation() );
		this.centre.image._update( this._updateImagePosition( source, width, height ) );
        this.centre.world._update( this.object.position );
        this.centre.polar._update( this._updateDistance( source ), this._updateBearing( source ) );
        this.res = new SRJS.Vector2(width, height);
		
		return this;
	};
	
	this._updateOrientation = function(){
		return new THREE.Vector3( SRJS.radToDeg(this.object.rotation.x), SRJS.radToDeg(this.object.rotation.y), SRJS.radToDeg(this.object.rotation.z) );
	};
	
	this._updateBearing = function( source ){
		if( typeof source === 'undefined' ){
			return new SRJS.Vector2( 0, 0 );
		}
		
		var direction = new SRJS.Vector2( source.position.x - this.object.position.x, source.position.z - this.object.position.z );
		if( direction.x === 0 && direction.y === 0 ){
			return new SRJS.Vector2( 0, 0 );
		}
		var up = new SRJS.Vector2( Math.sin(source.rotation.y), Math.cos(source.rotation.y) ),
			angle = up.angleTo( direction ),
		
			// http://stackoverflow.com/questions/3461453/determine-which-side-of-a-line-a-point-lies
			// Where a = line point 1; b = line point 2; c = point to check against.
			markerIsOnLeft = function( a, b, c ){
				return ((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) > 0;
			},
			sourcePosition = new SRJS.Vector2( source.position.x, source.position.z ),
			objectPosition = new SRJS.Vector2( this.object.position.x, this.object.position.z );
		
		if( markerIsOnLeft( sourcePosition, sourcePosition.add( up ), objectPosition ) ){
			angle = Math.PI * 2 - angle; // change it to be a bearing
		}
		return new SRJS.Vector2( 0, SRJS.radToDeg(angle) );
	};
	
	this._updateDistance = function( source ){
		if( typeof source === 'undefined' ){
			return 0;
		}
		
		return new SRJS.Vector2( source.position.x - this.object.position.x, source.position.z - this.object.position.z ).length();
	};
	
	this._updateImagePosition = function( source, width, height ){
		if( !( source instanceof SRJS.Robot ) ){
			return false;
		}
		
		return this._toRendererXY( this.object.position, source.camera, width, height );
	};
	
	// https://github.com/mrdoob/three.js/issues/78
	this._toRendererXY = function( position, cameraToUse, width, height ){

		var pos = position.clone(),
			projScreenMat = new THREE.Matrix4();
		projScreenMat.multiply( cameraToUse.projectionMatrix, cameraToUse.matrixWorldInverse );
		projScreenMat.multiplyVector3( pos );

		return new SRJS.Vector2( ( pos.x + 1 ) * width / 2,
			 ( - pos.y + 1 ) * height / 2 );

	};
	
	this.print = function(){
		console.log( 'code:', this.info.code );
        console.log( 'centre:', this.centre, this.centre.polar, this.centre.polar.length );
		console.log( 'centre (world): (', this.centre.world.x, ',', this.centre.world.y, ',', this.centre.world.z, ') cm' );
		console.log( 'centre (image): (', this.centre.image.x, ',', this.centre.image.y, ') px' );
		console.log( 'orientation (world): (', this.orientation.rot_x, ',', this.orientation.rot_y, ',', this.orientation.rot_z, ') deg' );
		console.log( 'centre (polar): (', this.centre.polar.rot_x, ',', this.centre.polar.rot_y, ') deg' );
		console.log( 'distance (polar):', this.centre.polar.length, 'cm' );
	};
	
    Object.defineProperty(this, 'dist', {
        get: function(){
            return this.centre.polar.length;
        }
    });
    
    Object.defineProperty(this, 'rot_y', {
        get: function(){
            return this.centre.polar.rot_y;
        }
    });
    
	this.update();

};

SRJS.MARKER_UNDEFINED = -1;
SRJS.MARKER_ARENA = 0;
SRJS.MARKER_ROBOT = 1;
SRJS.MARKER_TOKEN = 2;
SRJS.MARKER_BUCKET = 3;
SRJS.MARKER_BUCKET_SIDE = SRJS.MARKER_BUCKET;
SRJS.MARKER_BUCKET_END = SRJS.MARKER_BUCKET;

SRJS.MarkerInfo = function( code, type ){
    
    this.code = typeof code === 'number' ? code : 'Something important';
    this.type = typeof type === 'number' ? type : SRJS.MARKER_UNDEFINED;
    
    this._getOffset = function(){
        var start = -1;
        if( typeof this.code !== 'number' ){
            return start;
        }
        if( this.type === SRJS.MARKER_ARENA ){
            start = 0;
        } else if( this.type === SRJS.MARKER_ROBOT ){
            start = 28;
        } else if( this.type === SRJS.MARKER_TOKEN ){
            start = 32;
        } else if( this.type === SRJS.MARKER_BUCKET ){
            start = 72;
        }
        return this.code - start;
    };
    Object.defineProperty(this, 'offset', {
        get: this._getOffset
    });
    
    this._getSize = function(){
        if( this.type === SRJS.MARKER_ARENA ){
            return 0.25;
        } else if( this.type === SRJS.MARKER_ROBOT ||
                    this.type === SRJS.MARKER_TOKEN ||
                    this.type === SRJS.MARKER_BUCKET ){
            return 0.1;
        }
        return 0;
    };
    Object.defineProperty(this, 'size', {
        get: this._getSize
    });
    
};

SRJS.MarkerOrientation = function(){
    this.rot_x = null;
    this.rot_y = null;
    this.rot_z = null;
    
    this._update = function( newOrientation ){
        if( newOrientation instanceof THREE.Vector3 ){
            this.rot_x = newOrientation.x;
            this.rot_y = newOrientation.y;
            this.rot_z = newOrientation.z;
        }
    };
};

SRJS.MarkerPoint = function(){
    
    this.image = new SRJS.MarkerImagePoint();
    this.world = new SRJS.MarkerWorldPoint();
    this.polar = new SRJS.MarkerPolarPoint();
    
};

SRJS.MarkerImagePoint = function(){
    
    this.x = null;
    this.y = null;
    
    this._update = function( newPosition ){
        if( newPosition instanceof SRJS.Vector2 ){
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    };
    
};

SRJS.MarkerWorldPoint = function(){
    
    this.x = null;
    this.y = null;
    this.z = null;
    
    this._update = function( newPosition ){
        if( newPosition instanceof THREE.Vector3 ){
            this.x = newPosition.x;
            this.y = newPosition.y;
            this.z = newPosition.z;
        }
    };
    
};

SRJS.MarkerPolarPoint = function(){
    
    this.length = null;
    this.rot_x = null;
    this.rot_y = null;
    
    this._update = function( length, rotation ){
        if( length instanceof SRJS.Vector2 ){
            this.length = length.length();
        } else {
            this.length = length;
        }
        if( rotation instanceof SRJS.Vector2 ){
            this.rot_x = rotation.x;
            this.rot_y = rotation.y;
        }
    };
    
};

// FILE: robot/Query.js
SRJS.Query = function( query ){
	var args = Array.prototype.slice.call(arguments);
	this.queryType = 'or';
	if( typeof query === 'string' ){
		if( ['and', 'or'].indexOf( query ) === -1 ){
			console.error( 'The type of query must be one of the following:\n',
								'and, or');
			return;
		}
		this.queryType = query;
		args = args.slice( 1 );
	} else if( typeof query !== 'object' ){
		return;
	}
	
	this.args = args;
	
	this.watchers = new Array();
	this.callWatchers = function(){
        var objID = 0;
		this.args.forEach( function( element, index ){
            if( typeof element === 'object' ){
                this.watchers[objID]( eval( element.prop ), index );
                objID++;
            }
		}, this );
	};
	
	this.setUpQueries = function( arg ){
		arg.forEach(function( element, index ){
			if( element instanceof Array && element.length === 3 &&
					typeof element[0] === 'string' && typeof element[1] === 'string' ){
				var obj = {
					prop: element[0],
					type: element[1],
					val: element[2]
				};
				element = obj;
				arg[index] = obj;
                this.setUpQuery( element, index );
			} else if( typeof element === 'number' ){
                this.setUpTimeout( element, index );
            }
		}, this);
	};
	
	this.queryStatuses = new Array();
	this.timeoutIDs = new Array();
    
    this.parseValues = function( index, newval ){
        var a = 0,
            values = [];
        while( a < this.args.length ){
            if( this.queryStatuses[a] ){
                // if the query is a timeout, push a boolean indicating that it's finished
                if( typeof this.args[a] === 'number' ){
                    values.push( true );
                } else {
                    values.push( eval(this.args[a].prop) );
                }
            } else {
                // push null if the query isn't true
                values.push( null );
            }
            a++;
        }
        if( typeof index !== 'undefined' && typeof newval !== 'undefined' && values[index] !== null ){
            values[index] = newval;
        }
        return values;
    };
	
	this.updateQueryStatus = function( index, value, newval ){
		this.queryStatuses[index] = value;
		var valid = this.queryType === 'and' ? this.andCheck() : this.orCheck();
		if( valid && !this.unboundWatchers ){
			this.unbindWatchers();
			this.callback( this.parseValues( index, newval ) );
			return true;
		}
		return false;
	};
	
	this.unbindWatchers = function(){
		this.args.forEach( function( element ){
            if( typeof element === 'object' ){
                SRJS.unwatch( element.prop );
            }
		}, this );
        
        this.timeoutIDs.forEach( function( ID ){
            window.clearTimeout( ID );
        }, this );
        
        this.unboundWatchers = true;
	};
    
    this.unboundWatchers = false;
	
	this.andCheck = function(){
		var i = 0;
		while( i < this.queryStatuses.length ){
			if( !this.queryStatuses[i] ) return false;
			i++;
		}
		return true;
	};
	
	this.orCheck = function(){
		var i = 0;
		while( i < this.queryStatuses.length ){
			if( this.queryStatuses[i] ) return true;
			i++;
		}
		return false;
	};
    
    this.setUpTimeout = function( time, index ){
        this.queryStatuses[index] = false;
        var timeoutID = window.setTimeout(function(){
            this.updateQueryStatus( index, true );
        }.bind( this ), time * 1000);
        
        this.timeoutIDs.push( timeoutID );
    };
	
	this.setUpQuery = function( obj, index ){
		// ensure that the parameters are valid
		if( typeof obj !== 'object' ||
			(obj && (typeof obj.prop === 'undefined' ||
						typeof obj.type !== 'string' ||
						typeof obj.val == 'undefined'))){
			return;
		}
		
		var inputTypes = ['eq', 'gt', 'lt', 'ne', 'lte', 'gte'];
		var outputTypes = ['===', '>', '<', '!==', '<=', '>='];
		if( inputTypes.indexOf( obj.type ) === -1 ){
			console.error( 'The type of Query must be one of the following:\n',
								'eq, gt, lt, ne, lte, gte');
			return;
		}
		
		this.queryStatuses[index] = false;
		
		var comparison = outputTypes[ inputTypes.indexOf( obj.type ) ];
		var watcherActivation = function( newval, index ){
			var unbound = false;
			// is there a DRY way to do this without using eval()? function re-writing?
			if( eval( newval + comparison + obj.val ) ){
				unbound = this.updateQueryStatus( index, true, newval );
			} else {
				this.updateQueryStatus( index, false, newval );
			}
			return unbound;
		}.bind( this );
		
		this.watchers.push( watcherActivation );
		
		var watcherHandler = function( id, oldval, newval ){
			var unbound = watcherActivation( newval, index );
			/*
				Without checking to see if things are unbound, the logic goes as follows when the query becomes true:
					Reach assignment that turns the query true
					Do the various updating calls from the handler
					Unwatch the variable being assigned
					The setter no longer exists, so returning newval doesn't cause the value to update
				Manually setting the value ensures that it's set
			*/
			if( unbound ){
				this[id] = newval;
			}
			return newval;
		};
		SRJS.watch( obj.prop, watcherHandler );
	};
	
	this.setUpQueries( args );
	
};

// FILE: robot/Robot.js
SRJS.Robot = function( args ){
args = typeof args == 'undefined' ? {} : args;
if( SRJS.CURRENT_ARENA.robots.length < SRJS.CURRENT_ARENA.robotStartPositions.length ){
	
	this.startPosition = SRJS.CURRENT_ARENA.robotStartPositions[ SRJS.CURRENT_ARENA.robots.length ];
	this.startRotation = SRJS.CURRENT_ARENA.robotStartRotations[ SRJS.CURRENT_ARENA.robots.length ] || 0;
	
	var roundToMultipleOfFour = function( val ){
		if( val < 4 ){
			return 4;
		}
		return Math.ceil( val / 4.0 ) * 4;
	};
	this.bumpSensorCount = typeof args.bumpSensorCount != 'undefined' ? args.bumpSensorCount : typeof args.numberOfBumpSensors != 'undefined' ? args.numberOfBumpSensors : SRJS.bumpSensorsPerRobot;
	this.rangeFinderCount = typeof args.rangeFinderCount != 'undefined' ? args.rangeFinderCount : typeof args.numberOfRangeFinders != 'undefined' ? args.numberOfRangeFinders : SRJS.rangeFindersPerRobot;
	this.bumpSensorCount = roundToMultipleOfFour( this.bumpSensorCount );
	this.rangeFinderCount = roundToMultipleOfFour( this.rangeFinderCount );
	
	var defaultDimension = 50;
	
	this.height = 50;
	//this.height = typeof args.height === 'number' ? args.height : defaultDimension;
	this.width = typeof args.width === 'number' ? args.width : defaultDimension;
	this.length = typeof args.length === 'number' ? args.length : defaultDimension;
	
	SRJS.Cube.call( this, this.height,
					new THREE.Vector3( this.startPosition.x, 50 + this.height / 2, this.startPosition.y ),
					SRJS.Material.green );
	
	this.io = new SRJS.Robot.IO( this ); // need to initialise the IO before rotating the robot
	
	this.rotate( this.startRotation );
	
	this.camera = new THREE.Camera();
	this.addChild( this.camera );
	
	this.lastUpdate = Date.now();
	
	this.speed = typeof args.speed != 'undefined' ? args.speed : 1;
	
	// motor[0] is the left wheel, motor[1] is the right one
	this.motor = new Array();
	this.motor[0] = new SRJS.Motor();
	this.motor[1] = new SRJS.Motor();
    this.motors = this.motor;
	
	this.bindCallbackToRobot = function( callback ){
		// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
		var boundCallback = function(){
			// Since we don't know when the callback will be called, we'll need to reassign
			// robot so that it's referring to the correct thing
			robot = this;
            callback.apply( this, arguments );
		}.bind( this );
		
		return boundCallback;
	};
	
	this._continueTime = Date.now();	
	this.Yield = function( seconds, callback ){
		if( seconds instanceof SRJS.Query ){
			this._continueTime = Number.MAX_VALUE;
			
			seconds.callback = typeof callback === 'function' ? function( status ){
				this._continueTime = Date.now();
				var boundCallback = this.bindCallbackToRobot( callback );
				boundCallback( status );
			}.bind( this ) : function(){ this._continueTime = Date.now(); }.bind( this );
			seconds.callWatchers();
		} else {
			this._continueTime = Date.now() + seconds * 1000;
			
			callback = typeof callback === 'function' ? callback : function(){};
			window.setTimeout( this.bindCallbackToRobot( callback ),
									seconds * 999 );
		}
	};
    
    this.wait_for = this.Yield;
    this.waitFor = this.Yield;
	
	this.invokeRepeating = function( callback, initialDelay, repeatRate ){
		if( callback && typeof callback === 'function' ){
			SRJS.invokeRepeating( this.bindCallbackToRobot( callback ),
									initialDelay, repeatRate );
		}
	};
	
	this.runFrame = function(){
		if( Date.now() > this._continueTime ){
			robot = this;
			this.main();
		}
	};
	
	this.main = typeof args.main === 'function' ? args.main : function(){
		
	};
	
	this.initialise = typeof args.initialise === 'function' ? args.initialise : function(){
		
	};
	
	this.vision = SRJS.Vision( this );
    this.see = function( width, height ){
        if( typeof this.vision.see === 'function' ){
            return this.vision.see( width, height );
        }
    };
	
	this.gameScore = 0;
	this.gameSettings = {};
	
	this._reservedPropertyNames = new Array();
	this._customPropertyNames = new Array();
	/*
		Allows values to easily persist between multiple calls to this.main()
		Doesn't allow properties to be set that are used for the internals.
		Returns true or false depending on whether setting the property was successful.
	*/
	this.createProperty = function( name, initialValue ){
		if( typeof name !== 'string' ){
			return false;
		}
		if( this._reservedPropertyNames.indexOf( name ) === -1 ){
			// don't reset the value each time this.main() is called
			if( this._customPropertyNames.indexOf( name ) === -1 ){
				this[name] = initialValue;
				this._customPropertyNames.push( name );
			}
			return true;
		}
		return false;
	};
	
	// initialise the reserved proprty names array
	var prop;
	for( prop in this ){
		if( this.hasOwnProperty(prop) ){
			this._reservedPropertyNames.push( prop );
		}
	}
	robot = this;
	this.initialise();

}
};

SRJS.Robot.prototype = new SRJS.Cube();
SRJS.Robot.prototype.constructor = SRJS.Robot;

SRJS.Robot.prototype.rotate = function( theta ){
	this.rotation.y += theta;
};

SRJS.Robot.prototype.moveForward = function( distance ){
	this.translateZ( distance );
};

// FILE: robot/IO.js
SRJS.Robot.IO = function( parentRobot ){
	
	var sensorID, finderID;
	
	this.robot = parentRobot;
	
	this.input = function( ID ){
		if( ID < bumpSensor.length ){
			return bumpSensor[ID];
		}
	};
	
	this.bumpSensor = new Array();
	sensorID = 0;
	while( sensorID < this.robot.bumpSensorCount ){
		this.bumpSensor.push( new SRJS.Robot.BumpSensor( this.robot, sensorID ) );
		this.bumpSensor[sensorID].rect.rotateAroundPoint( this.robot.startPosition, this.robot.startRotation );
		sensorID++;
	}
	
	this.rangeFinder = new Array();
	finderID = 0;
	while( finderID < this.robot.rangeFinderCount ){
		this.rangeFinder.push( new SRJS.Robot.RangeFinder( this.robot, finderID ) );
		this.rangeFinder[finderID].ray.rotateAroundPoint( this.robot.startPosition, this.robot.startRotation );
		finderID++;
	}
	
	
};

// FILE: robot/BumpSensor.js
/*
	There are (numberOfBumpSensors / 4) bump sensors along the edge of each robot.
	They start in the front-left corner and move round clockwise.
	The corners are not covered.
*/
SRJS.Robot.BumpSensor = function( parentRobot, ID ){
	
	this.robot = parentRobot;
	
	var numberOfBumpSensors = this.robot.bumpSensorCount,
		xPos, yPos;
	
	ID = ID || 0;
	this.ID = ID < 0 ? 0 : ID > numberOfBumpSensors ? numberOfBumpSensors : ID;
	
	// code to work out position is pretty much the same for the Range Finder
	var edgeOffset = function( ID, edgeLength ){
		var edgePos = ID % ( numberOfBumpSensors / 4 );
		var offset = -((edgeLength / 2) -
						(edgePos * (edgeLength / (numberOfBumpSensors / 4))) -
						((edgeLength / (numberOfBumpSensors / 4)) / 2) );
		return offset;
	};

	// work out the position of the bump sensor
	if( ID < numberOfBumpSensors / 4 ){ // front
		xPos = this.robot.position.x + edgeOffset( ID, this.robot.width );
		yPos = this.robot.position.z - this.robot.length / 2;
	} else if( ID < (2 * numberOfBumpSensors / 4) ){ // right
		xPos = this.robot.position.x + this.robot.width / 2;
		yPos = this.robot.position.z + edgeOffset( ID, this.robot.length );
	} else if( ID < (3 * numberOfBumpSensors / 4) ){ // back
		xPos = this.robot.position.x - edgeOffset( ID, this.robot.width );
		yPos = this.robot.position.z + this.robot.length / 2;
	} else if( ID < (4 * numberOfBumpSensors / 4) ){ // left
		xPos = this.robot.position.x - this.robot.width / 2;
		yPos = this.robot.position.z - edgeOffset( ID, this.robot.length );
	}
	
	this.rect = new SRJS.Physics.Rectangle( false, true,
									new SRJS.Vector2( this.robot.width / (numberOfBumpSensors / 4),
														this.robot.length / (numberOfBumpSensors / 4) ),
									new SRJS.Vector2( xPos, yPos ),
									0,
									this );
	SRJS.phys.addBumpSensor( this );
	
	this.d = false;
	
	this._aGetter = function(){
		return 0;
	};
	
	Object.defineProperty(this, 'a', {
		get: this._aGetter
	});
	
	this._heightOfBaseGetter = function(){
		return this.robot.heightOfBase;
	};
	
	Object.defineProperty(this, 'heightOfBase', {
		get: this._heightOfBaseGetter
	});
	
	this._heightOfTopGetter = function(){
		return this.robot.heightOfTop;
	};
	
	Object.defineProperty(this, 'heightOfTop', {
		get: this._heightOfTopGetter
	});
	
};

// FILE: robot/RangeFinder.js
SRJS.Robot.RangeFinder = function( parentRobot, ID ){
	
	this.robot = parentRobot;
	
	var numberOfRangeFinders = this.robot.rangeFinderCount,
		xPos, yPos, rotation;
	
	ID = ID || 0;
	this.ID = ID < 0 ? 0 : ID > numberOfRangeFinders ? numberOfRangeFinders : ID;
	
	// code to work out position is pretty much the same for the Bump Sensor
	var edgeOffset = function( ID, edgeLength ){
		var edgePos = ID % ( numberOfRangeFinders / 4 );
		var offset = -((edgeLength / 2) -
						(edgePos * (edgeLength / (numberOfRangeFinders / 4))) -
						((edgeLength / (numberOfRangeFinders / 4)) / 2) );
		return offset;
	};

	// work out the position of the bump sensor
	if( ID < numberOfRangeFinders / 4 ){ // front
		xPos = this.robot.position.x + edgeOffset( ID, this.robot.width );
		yPos = this.robot.position.z - this.robot.length / 2;
		rotation = 0;
	} else if( ID < (2 * numberOfRangeFinders / 4) ){ // right
		xPos = this.robot.position.x + this.robot.width / 2;
		yPos = this.robot.position.z + edgeOffset( ID, this.robot.length );
		rotation = Math.PI * 1.5;
	} else if( ID < (3 * numberOfRangeFinders / 4) ){ // back
		xPos = this.robot.position.x - edgeOffset( ID, this.robot.width );
		yPos = this.robot.position.z + this.robot.length / 2;
		rotation = Math.PI;
	} else if( ID < (4 * numberOfRangeFinders / 4) ){ // left
		xPos = this.robot.position.x - this.robot.width / 2;
		yPos = this.robot.position.z - edgeOffset( ID, this.robot.length );
		rotation = Math.PI * 0.5;
	}
	
	this.ray = new SRJS.Physics.Ray( new SRJS.Vector2( xPos, yPos ),
										rotation, this );
	
	SRJS.phys.addRangeFinder( this );
	
	this._aGetter = function(){
		var raw = this.ray.distanceToIntersection,
			value = 0;
		if( raw > 0 ){
			value = 125 / raw;
			value = value > 3.3 ? 3.3 : value;
		} else if( raw === 0 ){
			value = 3.3;
		}
		return value;
	};
	
	this.a = 0;
	
	this.watch( 'this.ray.nearestIntersection', function( prop, val, newval ){
		this.parent.a = this.parent._aGetter();
		return newval;
	});
	
	this._heightOfBaseGetter = function(){
		return this.robot.heightOfTop / 2;
	};
	
	Object.defineProperty(this, 'heightOfBase', {
		get: this._heightOfBaseGetter
	});
	
	this._heightOfTopGetter = function(){
		return this.robot.heightOfTop / 2;
	};
	
	Object.defineProperty(this, 'heightOfTop', {
		get: this._heightOfTopGetter
	});
	
};

SRJS.Robot.RangeFinder.prototype.watch = SRJS.watch;

// FILE: robot/Motor.js
SRJS.Motor = function(){

	this.max = 100;
	this._target = 0;

};

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Working_with_Objects#Defining_Getters_and_Setters
SRJS.Motor.prototype.__defineGetter__('target',
	function(){
		return this._target;
	}
);
SRJS.Motor.prototype.__defineSetter__('target',
	function( value ){
		if( value > this.max ){
			this._target = this.max;
		} else if ( value < -this.max ){
			this._target = -this.max;
		} else {
			this._target = value;
		}
	}
);

// FILE: vision/Vision.js
SRJS.Vision = function( object ){
	if( SRJS.CURRENT_ARENA.visionVersion === 1 ){
		return new SRJS.VisionV1();
	} else {
		return new SRJS.VisionV2( object );
	}
};

// FILE: vision/VisionV1.js
SRJS.VisionV1 = function(){

	this.blobs = new Array();
	
	var canvas = document.createElement('canvas'),
		vision = this;
	
	this.canvas = canvas;
	this.canvas.width = SRJS.CURRENT_ARENA.renderer.domElement.width;
	this.canvas.height = SRJS.CURRENT_ARENA.renderer.domElement.height;
	document.body.appendChild( this.canvas );
	this.context = this.canvas.getContext('2d');
	
	this.update = function( renderer ){
		var img = new Image();
		
		img.onload = function(){
			vision.context.clearRect( 0, 0, vision.canvas.width, vision.canvas.height );
			vision.context.drawImage( img, 0, 0 );
			
			var imageData = vision.processData( vision.getImageData( vision.context ));
			vision.blobs = vision.detectBlobs( imageData );
			vision.context.putImageData( imageData, 0, 0 );
			vision.displayBlobs();
		};
		img.src = renderer.domElement.toDataURL('image/png');
	};
	
	// https://www.studentrobotics.org/cgit/robovis.git/tree/visfunc.cpp?id=bf115f6be5025c559e1f91bb39f90ac380150a6b
	this.detectBlobs = function( imgData ){
		// imgData should already have been run through this.processData()
		
		var span, spanStart, spansAbove,
			i, j,
			colors = imgData.colors,
			pixel = 1,
			foundSpan = false,
			spans = new Array(),
			row, col,
			blobs;
		
		// loop through the rows of the image
		for( row = 0; row < imgData.height; row++ ){
			span = spanStart = 0;
			if( spans.length > 0 ){
				spans = new Array();
			}
			
			// and do things with each column of each row
			for( col = 1; col < imgData.width; col++ ){
				// if two pixels next to each other aren't the same color
				if( colors[ pixel ] !== colors[ pixel - 1 ]
					|| col === imgData.width - 1 ){ // or you're going off the right of the screen
					// add the span just passed to the array if there's something there
					if( colors[ pixel - 1 ] !== SRJS.NOTHING ){
						spans[span] = {};
						spans[span].xMin = spans[span].xMinBottom = spanStart;
						spans[span].xMax = spans[span].xMaxBottom = col - 1;
						spans[span].yMin = spans[span].yMax = row;
						spans[span].color = colors[ pixel - 1 ];

						span++;
					}
									
					// indicate that you're starting a new span
					spanStart = col;
				}
				
				pixel++;
			}
			
			// make comparisons with the row above and join the two
			if( foundSpan && span > 0 ){
				for( i = 0; i < span; i++ ){
					for( j = 0; j < spansAbove.length; j++ ){
						// if the span on the current row and the one above are part of the same object
						if( spans[i].color === spansAbove[j].color && spansAbove[j].yMax === (row - 1)
							&& Math.abs(spans[i].xMinBottom - spansAbove[j].xMinBottom) < this.spanMaxOffset
							&& Math.abs(spans[i].xMaxBottom - spansAbove[j].xMaxBottom) < this.spanMaxOffset ){
							// merge the span on the current row into the ane above
							spansAbove[j].xMin = Math.min(spans[i].xMin, spansAbove[j].xMin);
							spansAbove[j].xMax = Math.max(spans[i].xMax, spansAbove[j].xMax);
							spansAbove[j].yMax = row;
							spansAbove[j].xMinBottom = spans[i].xMinBottom;
							spansAbove[j].xMaxBottom = spans[i].xMaxBottom;
							
							// indicate that the span has been used
							spans[i].color = SRJS.NOTHING;
							
							break;
						}
					}
				}
				
				// if there are any spans that haven't been merged, add them
				for( i = 0; i < span; i++ ){
					if( spans[i].color !== SRJS.NOTHING ){
						spansAbove.push( spans[i] );
					}
				}
			}
			
			// if you've found the first colored spans, make the fact known
			if( !foundSpan && span > 0 ){
				spansAbove = spans.slice(0, span - 1);
				foundSpan = true;
			}
			
			pixel++;
		}
		
		// create the blobs
		blobs = new Array();
		if( typeof spansAbove === 'object' && typeof spansAbove.length === 'number' ){
			var blob = 0;
			while( blob < spansAbove.length ){
				blobs.push( new SRJS.Blob( spansAbove[blob].xMin,
											spansAbove[blob].yMin,
											spansAbove[blob].xMax - spansAbove[blob].xMin,
											spansAbove[blob].yMax - spansAbove[blob].yMin,
											spansAbove[blob].color ) );
				
				blob++;
			}
		}
		
		return blobs;
	};
	
	this.displayBlobs = function(){
		var blob = 0;
		while( blob < this.blobs.length ){
			// set the colour to outline the blob
			if( this.blobs[blob].color === SRJS.RED ){
				this.context.strokeStyle = 'rgb(255,0,0)';
			} else if ( this.blobs[blob].color === SRJS.GREEN ){
				this.context.strokeStyle = 'rgb(0,255,0)';
			} else if ( this.blobs[blob].color === SRJS.BLUE ){
				this.context.strokeStyle = 'rgb(0,0,255)';
			}
			
			// draw the blob
			this.context.strokeRect( this.blobs[blob].xRaw, this.blobs[blob].yRaw,
										this.blobs[blob].widthRaw, this.blobs[blob].heightRaw );
			
			blob++;
		}
	};

};

SRJS.VisionV1.prototype.blueMin = 235;
SRJS.VisionV1.prototype.blueMax = 255;
SRJS.VisionV1.prototype.greenMin = 115;
SRJS.VisionV1.prototype.greenMax = 125;
SRJS.VisionV1.prototype.redMin = -1;
SRJS.VisionV1.prototype.redMax = 10;
SRJS.VisionV1.prototype.redSaturationMin = 0.9;

SRJS.VisionV1.prototype.spanMinLength = 2;
SRJS.VisionV1.prototype.spanMaxOffset = 4;

SRJS.VisionV1.prototype.processData = function( imgData ){
	var hsv = {},
		hsvH,
		fourI,
		data = imgData.data,
		dataLength = data.length / 4, // rgba
		colors = new Array( dataLength ),
		i;
	
	for( i = 0; i < dataLength; i++ ){
		fourI = i * 4;
		// convert the rgb data to hsv
		hsv = SRJS.VisionV1.prototype.rgbToHsv( data[fourI],
							data[fourI + 1],
							data[fourI + 2],
							hsv );
		hsvH = hsv.h;
		
		// check to see if the value is within the required range for each color
		if( hsvH > SRJS.VisionV1.prototype.blueMin
				&& hsvH < SRJS.VisionV1.prototype.blueMax ){
			// show as white
			data[fourI] = data[fourI + 1] = data[fourI + 2] = 255;
			colors[i] = SRJS.BLUE;
		} else if ( hsvH > SRJS.VisionV1.prototype.greenMin
				&& hsvH < SRJS.VisionV1.prototype.greenMax ){
			// show as a lightish grey
			data[fourI] = data[fourI + 1] = data[fourI + 2] = 170;
			colors[i] = SRJS.GREEN;
		} else if ( hsv.s > SRJS.VisionV1.prototype.redSaturationMin
				&& hsvH > SRJS.VisionV1.prototype.redMin
				&& hsvH < SRJS.VisionV1.prototype.redMax ){
			// show as a darkish grey
			data[fourI] = data[fourI + 1] = data[fourI + 2] = 100;
			colors[i] = SRJS.RED;
		} else {
			// show as a dark grey
			data[fourI] = data[fourI + 1] = data[fourI + 2] = 40;
			colors[i] = SRJS.NOTHING;
		}
	}
	
	imgData.colors = colors;
	imgData.data = data;
	
	return imgData;
};

SRJS.VisionV1.prototype.getImageData = function( canvasContext, x, y, width, height ){
	var imgData;
	
	x = x || 0;
	y = y || 0;
	width = width || canvasContext.canvas.width;
	height = height || canvasContext.canvas.height;
	
	// http://blog.project-sierra.de/archives/1577
	// http://stackoverflow.com/questions/4121142/javascript-getimagedata-for-canvas-html5
	try {
		try { 
			imgData = canvasContext.getImageData( x, y, width, height );
		} catch( e ) { 
			netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
			imgData = canvasContext.getImageData( x, y, width, height );
		}						  
	} catch ( e ) {
		throw new Error('Unable to access image data: ' + e);
	}

	return imgData;
};

// http://cs.haifa.ac.il/hagit/courses/ist/Lectures/Demos/ColorApplet2/t_convert.html
// https://github.com/mrdoob/three.js/blob/master/src/extras/ColorUtils.js
SRJS.VisionV1.prototype.rgbToHsv = function( r, g, b, hsv ){
	// var hsv = hsv || {}; // removing this seems to give a ~10% speed increase
	var min, max, delta, hsvH;
	
	max = Math.max( Math.max( r, g ), b );
	min = Math.min( Math.min( r, g ), b );
	
	hsv.v = max;
	
	if( max !== min ){
		delta = max - min;
		hsv.s = delta / max;
	} else {
		// r = g = b = 0
		hsv.s = 0;
		hsv.h = 0;
		return hsv;
	}
	
	if( r === max ){
		// between yellow and magenta
		hsvH = ( g - b ) / delta;
	} else if ( g === max ){
		// between cyan and yellow
		hsvH = 2 + ( b - r ) / delta;
	} else {
		// between magenta and cyan
		hsvH = 4 + ( r - g ) / delta;
	}
	
	hsvH *= 60;
	if( hsvH < 0 ){
		hsvH += 360;
	}
	
	hsv.h = hsvH;
	
	return hsv;
};

// FILE: vision/VisionV2.js
SRJS.VisionV2 = function( object ){
	
	this.object = object;
	
	var canvas = document.createElement('canvas'),
		vision = this;
	
	this.canvas = canvas;
	this.canvas.width = SRJS.CURRENT_ARENA.renderer.domElement.width;
	this.canvas.height = SRJS.CURRENT_ARENA.renderer.domElement.height;
	document.body.appendChild( this.canvas );
	this.context = this.canvas.getContext('2d');
	
	this.update = function( renderer ){
		var img = new Image();
		
		img.onload = function(){
			vision.context.clearRect( 0, 0, vision.canvas.width, vision.canvas.height );
			vision.context.drawImage( img, 0, 0 );
		};
		img.src = renderer.domElement.toDataURL('image/png');
	};
	
	this.print_marker = function( marker ){
		if( marker instanceof SRJS.Marker ){
			marker.print();
		}
	};
	
	this.printMarker = this.print_marker;
    
    this.see = function( width, height ){
        var markers = new Array(),
			i = 0,
			marker;
        
        width = typeof width != 'undefined' ? width : 800;
        height = typeof height != 'undefined' ? height : 600;
        
        while( i < SRJS.markers.length ){
			marker = SRJS.markers[i].update( this.object, width, height );
			if( (marker.centre.polar.rot_x < this.object.camera.fov / 2 || marker.centre.polar.rot_x > 360 - this.object.camera.fov / 2) 
                    && marker.object !== robot ){
				markers.push( marker );
			}
			i++;
		}
		
		return markers;
    };
	
};

// FILE: vision/Blob.js
SRJS.Blob = function( x, y, width, height, color, normalised ){

	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
	this.color = typeof color != 'undefined' ? color : SRJS.NOTHING;
	
	this.normalisationFactor = 100 / SRJS.rendererDimension;
	
	if( !normalised ){
		this.x *= this.normalisationFactor;
		this.y *= this.normalisationFactor;
		this.width *= this.normalisationFactor;
		this.height *= this.normalisationFactor;
	}
	
	Object.defineProperty(this, 'xRaw', {
		get: function(){
			return this.x / this.normalisationFactor;
		}
	});
	
	Object.defineProperty(this, 'yRaw', {
		get: function(){
			return this.y / this.normalisationFactor;
		}
	});
	
	Object.defineProperty(this, 'widthRaw', {
		get: function(){
			return this.width / this.normalisationFactor;
		}
	});
	
	Object.defineProperty(this, 'heightRaw', {
		get: function(){
			return this.height / this.normalisationFactor;
		}
	});
	
	this._massGetter = function(){
		return this.width * this.height;
	};
	
	Object.defineProperty(this, 'mass', {
		get: this._massGetter
	});
	
	this._colourGetter = function(){
		return this.color;
	};
	
	Object.defineProperty(this, 'colour', {
		get: this._colourGetter
	});

};

// FILE: vision/Colors.js
SRJS.NOTHING = 0;
SRJS.RED = 1;
SRJS.BLUE = 2;
SRJS.GREEN = 3;

