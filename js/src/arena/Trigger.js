SRJS.Trigger = function( width, height, depth, position, rotation, action ){
	
	SRJS.Wall.call( this, width, height, depth, position, rotation, SRJS.Material.blue );
	
	this.onRobotEnter = action || function( robotID ){};
	this.onRobotStay = function( robotID ){};
	this.onRobotExit = function( robotID ){ console.log('exit', robotID); };
	
	this.intersectingRobots = new Array();
	this.previousIntersectingRobots = new Array();
	
	SRJS.CURRENT_ARENA.triggers.push( this );

};

SRJS.Trigger.prototype = new SRJS.Wall();
SRJS.Trigger.prototype.constructor = SRJS.Trigger;
