SRJS.Arena = function( args ){

	if( typeof args === 'undefined' ){
		
		this.scene = new THREE.Scene();
		this.init = function(){
			console.error('No arguments passed to SRJS.Arena()');
		};
		
	} else {
		
		this.args = args;
		this.scene = args.scene || new THREE.Scene();
		this.physics = args.physics || new SRJS.Physics.Environment();
		this.arenaDimension = args.arenaDimension || 1;
		
		this.robots = new Array();
		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( SRJS.rendererDimension, SRJS.rendererDimension );
		document.body.appendChild( this.renderer.domElement );
		
		this.rendererContext = this.renderer.domElement.getContext('experimental-webgl');
		
		this.container = document.createElement('div');
		document.body.appendChild( this.container );
		
		this.camera = new THREE.QuakeCamera({
			fov: 50, aspect: window.innerWidth / window.innerHeight,
			near: 1, far: 20000,
			constrainVertical: true, verticalMin: 1.1, verticalMax: 2.2,
			movementSpeed: 1000, lookSpeed: 0.125,
			noFly: false, lookVertical: true, autoForward: false
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
			var arena = SRJS.CURRENT_ARENA;
			arena.physics.draw();
			arena.physics.update();
			
			var robot = 0;
			while( robot < arena.robots.length ){
				arena.robots[robot].main();
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
			
			/*if( SRJS.floatyCam || arena.robots.length === 0 ){
				arena.renderer.render( arena.scene, arena.camera );
			} else {
				arena.renderer.render( arena.scene, arena.robots[0].camera );
			}*/
			
			if( SRJS.displayRobotVision ){
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

SRJS.Arena.prototype.addRobot = function( robot ){
	this.robots[this.robots.length] = robot || new SRJS.Robot();
	this.scene.addObject( this.robots[this.robots.length - 1] );
};
