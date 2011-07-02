SRJS.Arena = function( args ){

	if( typeof args === 'undefined' ){
		
		this.scene = new THREE.Scene();
		this.init = function(){
			console.error('No arguments passed to SRJS.Arena()');
		};
		
	} else {
		
		this.args = args;
		this.scene = args.scene || new THREE.Scene();
		
		this.robots = new Array();
		
		this.renderer = new THREE.WebGLRenderer();
		//renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
		this.renderer.setSize( 200, 200 );
		document.body.appendChild( this.renderer.domElement );
		
		this.rendererContext = this.renderer.domElement.getContext('experimental-webgl');
		
		this.container = document.createElement('div');
		document.body.appendChild( this.container );
		
		this.camera = args.camera || function(){
			console.error('Incomplete arguments passed to SRJS.Arena() - missing camera');
		};
		
		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		this.container.appendChild( this.stats.domElement );
		
		this.animate = function(){
			var arena = SRJS.CURRENT_ARENA;
			var robot = 0;
			while( robot < arena.robots.length ){
				arena.robots[robot].move();
				arena.robots[robot].main();
				robot++;
			}
			
			requestAnimationFrame( arena.animate );
			arena.render();
			
			arena.stats.update();
		};
		
		this.render = function(){
			var arena = SRJS.CURRENT_ARENA;
			
			/*if( SRJS.floatyCam || arena.robots.length === 0 ){
				arena.renderer.render( arena.scene, arena.camera );
			} else {
				arena.renderer.render( arena.scene, arena.robots[0].camera );
			}*/
			
			var robot = 0;
			while( robot < arena.robots.length ){
				arena.renderer.render( arena.scene, arena.robots[robot].camera );
				arena.robots[robot].vision.update( arena.renderer );
				
				robot++;
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
