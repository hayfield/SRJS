SRJS.Robot = function(){
	
	SRJS.Cube.call( this, 50,
					new THREE.Vector3( 340, 75, 0 ),
					SRJS.Material.green );
	
	this.camera = new THREE.Camera();
	this.addChild( this.camera );
	
	this.lastUpdate = Date.now();
	
	this.speed = 1;
	
	// motor[0] = left, motor[1] = right
	this.motor = new Array();
	this.motor[0] = new SRJS.Motor();
	this.motor[1] = new SRJS.Motor();
	
	this.motor[0].target = 40;
	this.motor[1].target = 50;

};

SRJS.Robot.prototype = new SRJS.Cube();
SRJS.Robot.prototype.constructor = SRJS.Robot;

SRJS.Robot.prototype.move = function(){
	// work out how long since the last movement
	var elapsed = (Date.now() - this.lastUpdate) / 1000;
	this.lastUpdate = Date.now();
	
	// move each wheel forward
	var left = this.speed * this.motor[0].target * elapsed;
	var right = this.speed * this.motor[1].target * elapsed;
	
	// work out the angle between the two wheels
	var opposite = Math.max(left, right) - Math.min(left, right);
	var adjacent = 50;
	var angle = Math.atan( opposite / adjacent );
	
	if( this.motor[0].target > this.motor[1].target ){
		angle = -angle;
	}
	
	// move to the end of the line with the wheel that moved the shortest distance
	this.translateZ( -Math.min( left, right ) );
	this.rotation.y += angle;
};
