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
	var e, o, trigger, intersects;
	
	intersects = false;
	e = 0
	while( e < this.edges.length ){
	
		o = 0;
		while( o < other.edges.length ){
			if( this.edges[e].intersects( other.edges[o] ) ){
				if( this.object instanceof SRJS.Robot.BumpSensor ){
					return true;
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
