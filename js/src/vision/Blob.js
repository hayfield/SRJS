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
