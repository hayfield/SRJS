SRJS.Marker = function( parentObject ){
	
	this.object = parentObject;
	
	this.centre = {};
	
	this._update = function( source ){
		this.centre.world = this.object.position,
		this.rotation = this.object.rotation,
		this.bearing = this._updateBearing( source )
	};
	
	this._updateBearing = function( source ){
		if( typeof source === 'undefined' ){
			return new SRJS.Vector2( 0, 0 );
		}
		
		var direction = new SRJS.Vector2( source.position.x - this.object.position.x, source.position.z - this.object.position.z );
		if( direction.x === 0 && direction.y === 0 ){
			return new SRJS.Vector2( 0, 0 );
		}
		var up = new SRJS.Vector2( 0, 1 ),
			angle = up.angleTo( direction );
		
		if( direction.x < 0 ){
			angle = Math.PI * 2 - angle; // change it to ba bearing
		}
		return new SRJS.Vector2( angle, 0 );
	};
	
	this._update();

};
