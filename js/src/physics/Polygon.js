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
	var e, o, intersects, intersection,
		thisObj = this.object,
		otherObj = other.object,
		thisEdges = this.edges,
		otherEdges = other.edges;
	
	if( otherObj.heightOfBase > thisObj.heightOfTop ||
			thisObj.heightOfBase > otherObj.heightOfTop ){
		return false;
	}
	
	if( pushableCheck && otherObj instanceof SRJS.Robot ){
		return false;
	}
	
	// make robots push pushable objects
	if( !pushableCheck && otherObj instanceof SRJS.Pushable && thisObj instanceof SRJS.Robot ){
		var result = this.SAT( other, false );
		if( result === null ) return false;
		result.separation = result.vector.multiply( result.distance );
		
		if( !other.hasIntersections( SRJS.phys.polygons, true ) ){
			other.translate( result.separation.x, Math.PI * 0.5 );
			other.translate( result.separation.y, 0 );
			otherObj.position.x += result.separation.x;
			otherObj.position.z += result.separation.y;
			return false;
		} else {
			return true;
		}
	}
	
	intersects = false;
	e = 0;
	while( e < thisEdges.length ){
	
		o = 0;
		while( o < otherEdges.length ){
			intersection = thisEdges[e].intersects( otherEdges[o] );
			if( intersection ){
				if( thisObj instanceof SRJS.Robot.BumpSensor ){
					return true;
				} else if( thisObj instanceof SRJS.Robot.RangeFinder ){
					if( otherObj !== thisObj.robot ){
						thisObj.ray.intersections.push( intersection, other.trigger );
						intersects = true;
					}
				} else {
					SRJS.intersections.push( thisEdges[e].intersects( otherEdges[o] ), other.trigger );
					intersects = true;
				}
			}
			o++;
		}
		e++;
	}
	
	if( intersects ){
		if( thisObj instanceof SRJS.Robot && otherObj instanceof SRJS.Trigger ){
			otherObj.intersectingRobots.push( thisObj.ID );
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
