SRJS.Init = function(){

	SRJS.phys = new SRJS.Physics.Environment();
	var bob = new SRJS.Arena2011();
	
	var args = {
		/*main: function(){
			if( typeof count === 'undefined' ){
				count = 0;
			}
			if( count < 50 ){
				this.motor[0].target = 50;
				console.log('bunnies', count);
				count++;
			}
		}*///main: mainFunct
		main: rangeDist
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

var rangeDist = function(){
	console.log( robot.ID );
	
	var setMotors = function( left, right ){
		robot.motor[0].target = left;
		robot.motor[1].target = right;
	};
	
	if( this.io.rangeFinder[0].a < 1.3 ){
		console.log('forward');
		setMotors( 100, 100 );
		this.yield( 1, function(){
			console.log('bobblehead', robot);
			robot.motor[0].target = 0;
			robot.motor[1].target = 0;
			robot.yield(2, function(){
				console.log('yummy pie');
				robot.motor[0].target = 50;
				robot.motor[1].target = 100;
				robot.yield(2);
			});
		});
	}
	if( this.io.bumpSensor[3].d || this.io.bumpSensor[4].d || this.io.bumpSensor[6].d ){
		setMotors( -100, 0 );
		console.log('going back');
		this.yield( 0.5 );
	} else if( this.io.bumpSensor[1].d || this.io.bumpSensor[10].d || this.io.bumpSensor[11].d ){
		setMotors( 0, -100 );
	} else if( this.io.rangeFinder[0].a > 1.3 ){
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
	}
	if( this.io.bumpSensor[1].d || this.io.bumpSensor[2].d ){
		setMotors( -100, -100 );
		this.yield( 0.3 );
	}
	//console.log(this.io.rangeFinder[0].a);
};

BlobLine = function(){
	VISION_HEIGHT = SRJS.rendererDimension;
	
	this.Xmean = function(){
		return this.sumOfX / this.numberOfBlobs;
	};

	this.Ymean = function(){
		return this.sumOfY / this.numberOfBlobs;
	};
	
	this.Sxx = function(){
		return this.sumOfXSquared - (this.numberOfBlobs * this.Xmean() * this.Xmean());
	};
	
	this.Sxy = function(){
		return this.sumOfXY - (this.numberOfBlobs * this.Xmean() * this.Ymean());
	};
	
	this.calculateLine = function(){
		var sxy = this.Sxy();
		var sxx = this.Sxx();
		if( this.numberOfBlobs > 1 && sxx !== 0 && sxy !== 0 ){
			this.m = sxy / sxx;
			this.c = this.Ymean() - (this.Xmean() * this.m);
			this.xTop = (VISION_HEIGHT - this.c) / this.m;
		}
	};
	
	this.reset = function(){
		this.sumOfX = 0;
		this.sumOfY = 0;
		this.sumOfXSquared = 0;
		this.sumOfXY = 0;
		this.numberOfBlobs = 0;
		this.m = 0;
		this.c = 0;
	};
	
	this.addBlob = function( blob ){
		var xVal = blob.x + blob.width / 2;
		var yVal = VISION_HEIGHT - (blob.y + blob.height / 2);
		this.sumOfX += xVal;
		this.sumOfY += yVal;
		this.sumOfXSquared += xVal * xVal;
		this.sumOfXY += xVal * yVal;
		this.numberOfBlobs ++;
	};
	
	this.reset();
};

var mainFunct = function(){
	var blueLine = new BlobLine(),
		blobs = this.vision.blobs,
		foundBlue = false,
		largestBlueMass = 0,
		largestBlue;
	
	blobs.forEach( function( blob ){
		if( blob.color === SRJS.BLUE ){
			//console.log(blob.x, blob.y, blob.mass);
			foundBlue = true;
			blueLine.addBlob( blob );
			if( blob.mass > largestBlueMass ){
				largestBlue = blob;
				largestBlueMass = blob.mass;
			}
			blueLine.calculateLine();
		}
	});
	
	if( foundBlue && largestBlueMass < 150 ){
		this.lastSawBlue = 0;
	} else {
		this.lastSawBlue++;
	}
	//console.log( 'working with blue y =', blueLine.m, 'x +', blueLine.c );
	if( foundBlue && (largestBlueMass < 150 || blueLine.numberOfBlobs >= 2 ) ){
	//	console.log( 'working with blue y =', blueLine.m, 'x +', blueLine.c );
	}
	
	/*if( typeof count === 'undefined' ){
		count = 0;
	}
	if( count < 20 ){
		var jim = new BlobLine();
		count++;
	}*/
};
