SRJS.Trigger = function( width, height, depth, position, rotation, action ){
	
	SRJS.Wall.call( this, width, height, depth, position, rotation, SRJS.Material.yellow );
	
	this.onRobotEnter = action || function( robotID ){ console.log('enter', robotID); };
	//this.onRobotEnter = function( robotID ){ console.log('enter', robotID); };
	this.onRobotStay = function( robotID ){ /*console.log('stay', robotID);*/ };
	this.onRobotExit = function( robotID ){ /*console.log('exit', robotID);*/ };
	
	this.intersectingRobots = new Array();
	this.previousIntersectingRobots = new Array();
	
	SRJS.CURRENT_ARENA.triggers.push( this );

};

SRJS.Trigger.prototype = new SRJS.Wall();
SRJS.Trigger.prototype.constructor = SRJS.Trigger;
