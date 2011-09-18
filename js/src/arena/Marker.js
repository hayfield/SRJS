SRJS.Marker = function( parentObject ){
	
	this.object = parentObject;
	
	this.centre = {};
	
	this._update = function( source ){
		this.centre.world = this.object.position;
		this.rotation = this.object.rotation;
		this.bearing = this._updateBearing( source );
		this.distance = this._updateDistance( source );
		this.centre.image = this._updateImagePosition( source );
		this.code = 'Something important';
	};
	
	this._updateBearing = function( source ){
		if( typeof source === 'undefined' ){
			return new SRJS.Vector2( 0, 0 );
		}
		
		var direction = new SRJS.Vector2( source.position.x - this.object.position.x, source.position.z - this.object.position.z );
		if( direction.x === 0 && direction.y === 0 ){
			return new SRJS.Vector2( 0, 0 );
		}
		var up = new SRJS.Vector2( Math.sin(this.object.rotation), Math.cos(this.object.rotation) ),
			angle = up.angleTo( direction );
		
		if( direction.x < 0 ){
			angle = Math.PI * 2 - angle; // change it to be a bearing
		}
		return new SRJS.Vector2( angle, 0 );
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

		var pos = position.clone();
		projScreenMat = new THREE.Matrix4();
		projScreenMat.multiply( cameraToUse.projectionMatrix, cameraToUse.matrixWorldInverse );
		projScreenMat.multiplyVector3( pos );

		return new SRJS.Vector2( ( pos.x + 1 ) * SRJS.rendererDimension / 2,
			 ( - pos.y + 1 ) * SRJS.rendererDimension / 2 );

	};
	
	this._update();

};
