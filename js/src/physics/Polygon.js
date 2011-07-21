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
	var p = 0;
	intersections.length = 0;
	while( p < polygons.length ){
		if( polygons[p] !== this ){
			this.intersectsWith( polygons[p] );
		}
		
		p++;
	}
	console.log(intersections.length);
};

SRJS.Physics.Polygon.prototype.intersectsWith = function( other ){
	var e = 0;
	while( e < this.edges.length ){
		var o = 0;
		while( o < other.edges.length ){
			if( this.edges[e].intersects( other.edges[o] ) ){
				intersections.push( this.edges[e].intersects( other.edges[o] ) );
			}
			
			o++;
		}
		
		e++;
	}
};
