SRJS.Init = function(){

	SRJS.phys = new SRJS.Physics.Environment();
	var bob = new SRJS.Arena2011();
	
	var args = {
		main: rangeDist,
		initialise: initSetup
	};

	SRJS.CURRENT_ARENA.addRobot( args );
	
	/*var robby = new SRJS.Robot();
	robby.motor[0].target = 30;
	SRJS.CURRENT_ARENA.addRobot( robby );
	SRJS.CURRENT_ARENA.addRobot();
	SRJS.CURRENT_ARENA.robots[2].motor[0].target = 35;
	SRJS.CURRENT_ARENA.addRobot();
	SRJS.CURRENT_ARENA.robots[3].motor[0].target = 45;
	*/
	
};

var initSetup = function(){
	var jim = function(){
		console.log('timeout', Date.now(), this.fab, this);
		this.fab++;
	}.bind( this );
	var bob = function(){
		console.log('fabulous', Date.now(), this.fab, this);
	};
	this.createProperty('fab', 3);
	//SRJS.invokeRepeating( jim, 2000 );
	//this.invokeRepeating( bob, 1500 );
};
var frame = 0;
var updates = 0;
var limit = false;
setTimeout( function(){ limit = true }, 10000 );
var rangeDist = function(){
	//console.log( robot.ID );
	updates = 0;
	var setMotors = function( left, right ){
		robot.motor[0].target = left;
		robot.motor[1].target = right;
		//console.log('set motors', left, right, frame);
	};
	console.log('going', frame);
	setMotors(100, 100);
	//if( frame === 1 ){
	this.yield( new SRJS.Query( 'and', { prop: 'robot.io.bumpSensor[0].d',
								type: 'eq',
								val: true }, {
									prop: 'limit',
									type: 'eq',
									val: true
								} ), function(){console.log('bumped');
								this.motor[0].target = -100;
				this.motor[1].target = -100;
				this.yield(3);} );
	
	//}
	return;
	if( this.io.rangeFinder[0].a < 1.3 ){
		//console.log('forward');
		setMotors( 100, 100 );
		/*this.yield( 1, function(){
			console.log('bobblehead', robot);
			robot.motor[0].target = 0;
			robot.motor[1].target = 0;
			robot.yield(2, function(){
				console.log('yummy pie');
				robot.motor[0].target = 50;
				robot.motor[1].target = 100;
				robot.yield(2);
			});
		});*/
	}
	if( this.io.bumpSensor[3].d || this.io.bumpSensor[4].d || this.io.bumpSensor[6].d ){
		setMotors( -100, 0 );
		console.log('going back');
		this.yield( 0.5 );
	} else if( this.io.bumpSensor[1].d || this.io.bumpSensor[10].d || this.io.bumpSensor[11].d ){
		setMotors( 0, -100 );
	}/* else if( this.io.rangeFinder[0].a > 1.3 ){
		console.log('turn');
		setMotors( 0, 100 );
		this.yield( 0.2 );
	}
	if( this.io.rangeFinder[1].a > 3 && !(this.io.bumpSensor[7].d || this.io.bumpSensor[8].d) ){
		console.log('right sensor');
		setMotors( 50, 100 );
	}
	if( this.io.rangeFinder[3].a > 2.5 && !(this.io.bumpSensor[11].d || this.io.bumpSensor[12].d) ){
		console.log('left sensor');
		setMotors( 100, 50 );
	}*/
	if( this.io.bumpSensor[1].d || this.io.bumpSensor[2].d ){
		setMotors( -100, -100 );
		this.yield( 0.3 );
	}
	//console.log(this.io.rangeFinder[0].a);
};
