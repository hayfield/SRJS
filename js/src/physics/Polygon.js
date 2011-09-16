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
	
	if( pushableCheck && other.object instanceof SRJS.Robot ){
		return false;
	}
	
	if( !pushableCheck && other.object instanceof SRJS.Pushable && this.object instanceof SRJS.Robot ){
		var result2 = this.SAT( other, false );
		if( result2 === null ) return false;
		result2.separation = result2.vector.multiply( result2.distance );
		
		if( !other.hasIntersections( SRJS.phys.polygons, true ) ){
			other.translate( result2.separation.x, Math.PI * 0.5 );
			other.translate( result2.separation.y, 0 );
			other.object.position.x += result2.separation.x;
			other.object.position.z += result2.separation.y;
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
	var e, p,
		projectionAxis,
		minThis, maxThis, minOther, maxOther,
		dot,
		distMin, distMinAbs, shortestDist, result,
		thisPosition, otherPosition, offset, offsetShift;
	
	minThis = Number.MAX_VALUE;
	minOther = minThis;
	maxThis = Number.MIN_VALUE;
	maxOther = maxThis;
	shortestDist = Number.MAX_VALUE;
	result = {};
	thisPosition = new SRJS.Vector2( this.object.position.x, this.object.position.z );
	otherPosition = new SRJS.Vector2( other.object.position.x, other.object.position.z );
	offset = new SRJS.Vector2( thisPosition.x - otherPosition.x, thisPosition.y - otherPosition.y );
	
	// loop through the edges on the polygons
	for( e = 0; e < this.edges.length; e++ ){
		// find the normal to the edge (to project points onto)
		projectionAxis = this.edges[e].normal.normalise();
		
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
		offsetShift = projectionAxis.dot( offset );
		minThis += offsetShift;
		maxThis += offsetShift;
		
		// test for intersections
		if( (minThis - maxOther) > 0 || (minOther - maxThis) > 0 ){
			// gap found
			//console.log("gap", minThis, maxThis, minOther, maxOther);
			return null;
		}
		
		// find the distance that they need moving to separate
		distMin = (maxOther - minThis) * -1;
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
