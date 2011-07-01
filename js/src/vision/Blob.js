SRJS.Blob = function( x, y, width, height, color ){

	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
	this.color = color || SRJS.NOTHING;

};

SRJS.Blob.prototype.__defineGetter__('mass',
	function(){
		return this.width * this.height;
	}
);
