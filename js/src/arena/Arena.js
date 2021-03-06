SRJS.Arena = function( args ){

	if( typeof args === 'undefined' ){
		
		this.scene = new THREE.Scene();
		this.init = function(){
			console.error('No arguments passed to SRJS.Arena()');
		};
		
	} else {
		
		SRJS.CURRENT_ARENA = this;
		
		this.physics = args.physics || new SRJS.Physics.Environment();
		this.arenaDimension = typeof args.arenaDimension != 'undefined' ? args.arenaDimension : 1;
		
		this.triggers = new Array();
		this.robots = new Array();
		this.robotStartPositions = args.robotStartPositions;
		this.robotStartRotations = args.robotStartRotations;
		// ensure the length of the rotation array is the same as the position one
		var r = this.robotStartRotations.length;
		while( r < this.robotStartPositions.length ){
			this.robotStartRotations.push( 0 );
			r++;
		}
		
		args.initScene();
		
		this.args = args;
		this.scene = args.scene || new THREE.Scene();
		
		this.visionVersion = typeof args.visionVersion != 'undefined' ? args.visionVersion : 2;
		
		this.renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer;
		this.renderer.setSize( SRJS.rendererDimension, SRJS.rendererDimension );
		document.body.appendChild( this.renderer.domElement );
		
		this.rendererContext = this.renderer.domElement.getContext('experimental-webgl');
		
		this.container = document.createElement('div');
		document.body.appendChild( this.container );
		
		this.camera = new THREE.QuakeCamera({
            fov: SRJS.fov,
            aspect: window.innerWidth / window.innerHeight,
            near: 1,
            far: 20000,
            constrainVertical: true,
            verticalMin: 1.1,
            verticalMax: 2.2,
            movementSpeed: 1000,
            lookSpeed: 0.125,
            noFly: false,
            lookVertical: true,
            autoForward: false
		});
		this.camera.position.y = 100;
		
		// don't always display the stats pane
		if( SRJS.displayStats ){
			this.stats = new Stats();
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.top = '0px';
			this.container.appendChild( this.stats.domElement );
		}
		
		this.animate = function(){
			var arena = SRJS.CURRENT_ARENA,
				robot;
			
			arena.physics.update();
			arena.callRobotTriggerEvents();
			
			robot = 0;
			while( robot < arena.robots.length ){
				arena.robots[robot].runFrame();
				robot++;
			}
			
			requestAnimationFrame( arena.animate );
			arena.render();
			
			if( SRJS.displayStats && arena.stats ){
				arena.stats.update();
			}
		};
		
		this.render = function(){
			var arena = SRJS.CURRENT_ARENA;
			
			if( SRJS.robotVision ){
				var robot = 0;
				while( robot < arena.robots.length ){
					arena.renderer.render( arena.scene, arena.robots[robot].camera );
					arena.robots[robot].vision.update( arena.renderer );
					
					robot++;
				}
			}
			
			arena.renderer.render( arena.scene, arena.camera );
		};
		
		SRJS.CURRENT_ARENA = this;
		
		this.animate();
	
	}
	
};

/*
	Takes only a single (optional) parameter.
	This can be either an instance of SRJS.Robot() or an args object to specify how a new robot should be created.
	If there is no parameter, a robot with default settings will be created.
*/
SRJS.Arena.prototype.addRobot = function( robot ){
	
	if( robot && !(robot instanceof SRJS.Robot) && typeof robot === 'object' ){
		var args = robot;
		robot = new SRJS.Robot( args );
	}
	
	this.robots[this.robots.length] = robot || new SRJS.Robot();
	this.robots[this.robots.length - 1].ID = this.robots.length;
	
	this.scene.addObject( this.robots[this.robots.length - 1] );
    SRJS.CreateMarker( this.robots[this.robots.length - 1], 28 + (this.robots.length - 1), SRJS.MARKER_ROBOT );
	
};

SRJS.Arena.prototype.getRobot = function( robotID ){
	var r = 0;
	while( r < this.robots.length ){
		if( this.robots[r].ID === robotID ){
			return this.robots[r];
		}
		
		r++;
	}
	
	return false;
};

SRJS.Arena.prototype.callRobotTriggerEvents = function(){

	var t, i, trigger;
	t = 0;
	while( t < this.triggers.length ){
		trigger = this.triggers[t];
		
		i = 0;
		while( i < trigger.previousIntersectingRobots.length ){
			if( trigger.intersectingRobots.indexOf( trigger.previousIntersectingRobots[i] ) !== -1 ){
				trigger.onRobotStay( trigger.previousIntersectingRobots[i] );
			} else if( trigger.intersectingRobots.indexOf( trigger.previousIntersectingRobots[i] ) === -1 ){
				trigger.onRobotExit( trigger.previousIntersectingRobots[i] );
			}
			
			i++;
		}
		
		i = 0;
		while( i < trigger.intersectingRobots.length ){
			if( trigger.previousIntersectingRobots.indexOf( trigger.intersectingRobots[i] ) === -1 ){
				trigger.onRobotEnter( trigger.intersectingRobots[i] );
			}
			
			i++;
		}
		trigger.previousIntersectingRobots = trigger.intersectingRobots;
		trigger.intersectingRobots = [];
		
		t++;
	}
	
};
