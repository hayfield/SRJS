SRJS.Trigger = function( width, height, depth, position, rotation, action ){
	
	SRJS.Wall.call( this, width, height, depth, position, rotation, SRJS.Material.blue );
	
	this.onRobotEnter = action || new function(){};
	
	SRJS.CURRENT_ARENA.triggers.push( this );

};

SRJS.Trigger.prototype = new SRJS.Wall();
SRJS.Trigger.prototype.constructor = SRJS.Trigger;
