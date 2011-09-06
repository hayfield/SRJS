SRJS.Blob = function( x, y, width, height, color ){

	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
	this.color = color || SRJS.NOTHING;
	
	this._massGetter = function(){
		return this.width * this.height;
	};
	
	Object.defineProperty(this, 'mass', {
		get: this._massGetter
	});

};
