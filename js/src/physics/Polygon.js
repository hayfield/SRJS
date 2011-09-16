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

SRJS.Physics.Polygon.prototype.hasIntersections = function( polygons ){
	var p, solidIntersectionsStart, intersects;
	solidIntersectionsStart = SRJS.intersections.solids.length;
	intersects = false;
	
	p = 0;
	while( p < polygons.length ){
		if( polygons[p] !== this ){
			if( !(this.object instanceof SRJS.Robot.BumpSensor) ||
				((this.object instanceof SRJS.Robot.BumpSensor) && !(polygons[p].object instanceof SRJS.Robot) &&
					!(polygons[p].object instanceof SRJS.Trigger)) ){
				if( this.intersectsWith( polygons[p] ) ){
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

SRJS.Physics.Polygon.prototype.intersectsWith = function( other ){
	var e, o, intersects, intersection;

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
SRJS.Physics.Polygon.prototype.SAT = function( other ){
	var e, p,
		projectionAxis,
		minThis, maxThis, minOther, maxOther,
		dot,
		distMin, distMinAbs, shortestDist, result;
	
	minThis = Number.MAX_VALUE;
	minOther = minThis;
	maxThis = Number.MIN_VALUE;
	maxOther = maxThis;
	shortestDist = Number.MAX_VALUE;
	result = {};
	
	// loop through the edges on the polygons
	for( e = 0; e < this.edges.length; e++ ){
		// find the normal to the edge (to project points onto)
		projectionAxis = this.edges[e].normal;
		
		// project both of the polygons
		// loop through all the edges. Each edges has 2 points, so projecting twice as many as needed
		// this polygon
		for( p = 0; p < this.edges.length; p++ ){
			dot = projectionAxis.dot( this.edges[p].start );
			if( dot < minThis ) minThis = dot;
			if( dot > maxThis ) maxThis = dot;
			
			dot = projectionAxis.dot( this.edges[p].end );
			if( dot < minThis ) minThis = dot;
			if( dot > maxThis ) maxThis = dot;
		}
		// other polygon
		for( p = 0; p < other.edges.length; p++ ){
			dot = projectionAxis.dot( other.edges[p].start );
			if( dot < minOther ) minOther = dot;
			if( dot > maxOther ) maxOther = dot;
			
			dot = projectionAxis.dot( other.edges[p].end );
			if( dot < minOther ) minOther = dot;
			if( dot > maxOther ) maxOther = dot;
		}
		
		// shift the points of one of them by some sort of offset
		// only when using local coordinates for points?
		
		// test for intersections
		if( (minThis - maxOther) > 0 || (minOther - maxOther) > 0 ){
			// gap found
			return null;
		}
		
		// find the distance that they need moving to separate
		distMin = (maxOther - minThis) * -1;
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
