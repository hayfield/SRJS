SRJS.Robot.IO = function(){
	
	Array.call( this );
	
	this.input = function( ID ){
		if( ID < bumpSensor.length ){
			return bumpSensor[ID];
		}
	};
	
	this.bumpSensor = new Array();
	
	
	
};

SRJS.Robot.IO.prototype = new Array();
SRJS.Robot.IO.prototype.constructor = SRJS.Robot.IO;
