SRJS.Marker = function( parentObject, code, type ){
    
	this.object = parentObject;
	
    this.info = new SRJS.MarkerInfo( code, type );
	this.centre = new SRJS.MarkerPoint();
    
    this.timestamp = Date.now();
	
	this.update = function( source ){
        this.timestamp = Date.now();
		this.rotation = this._updateRotation();
		this.bearing = this._updateBearing( source );
		this.distance = this._updateDistance( source );
		this.centre.image._update( this._updateImagePosition( source ) );
        this.centre.world._update( this.object.position );
        this.centre.polar._update( this.distance, this.bearing );
		
		return this;
	};
	
	this._updateRotation = function(){
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
		return new SRJS.Vector2( SRJS.radToDeg(angle), 0 );
	};
	
	this._updateDistance = function( source ){
		if( typeof source === 'undefined' ){
			return 0;
		}
		
		return new SRJS.Vector2( source.position.x - this.object.position.x, source.position.z - this.object.position.z ).length();
	};
	
	this._updateImagePosition = function( source ){
		if( !( source instanceof SRJS.Robot ) ){
			return false;
		}
		
		return this.toRendererXY( this.object.position, source.camera );
	};
	
	// https://github.com/mrdoob/three.js/issues/78
	this.toRendererXY = function( position, cameraToUse ){

		var pos = position.clone(),
			projScreenMat = new THREE.Matrix4();
		projScreenMat.multiply( cameraToUse.projectionMatrix, cameraToUse.matrixWorldInverse );
		projScreenMat.multiplyVector3( pos );

		return new SRJS.Vector2( ( pos.x + 1 ) * SRJS.rendererDimension / 2,
			 ( - pos.y + 1 ) * SRJS.rendererDimension / 2 );

	};
	
	this.print = function(){
		console.log( 'code:', this.info.code );
        console.log( 'centre:', this.centre, this.centre.polar, this.centre.polar.length );
		console.log( 'centre (world): (', this.centre.world.x, ',', this.centre.world.y, ',', this.centre.world.z, ') cm' );
		console.log( 'centre (image): (', this.centre.image.x, ',', this.centre.image.y, ') px' );
		console.log( 'rotation (world): (', this.rotation.x, ',', this.rotation.y, ',', this.rotation.z, ') deg' );
		console.log( 'bearing (world): (', this.bearing.x, ',', this.bearing.y, ') deg' );
		console.log( 'distance (world):', this.distance, 'cm' );
	};
	
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
    
    this.code = code || 'Something important';
    this.type = type || SRJS.MARKER_UNDEFINED;
    
    this.offset = null;
    this.size = null;
    
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
