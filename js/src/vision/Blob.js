SRJS.Blob = function(){

	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;

};

SRJS.Blob.prototype.__defineGetter__('mass',
	function(){
		return this.width * this.height;
	}
);
