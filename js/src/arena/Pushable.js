SRJS.Pushable = function( width, height, depth, position, rotation ){
	
	SRJS.Wall.call( this, width, height, depth, position, rotation, SRJS.Material.blue );

};

SRJS.Pushable.prototype = new SRJS.Wall();
SRJS.Pushable.prototype.constructor = SRJS.Pushable;
