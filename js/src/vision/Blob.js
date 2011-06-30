SRJS.Blob = function( x, y, width, height ){

	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;

};

SRJS.Blob.prototype.__defineGetter__('mass',
	function(){
		return this.width * this.height;
	}
);
