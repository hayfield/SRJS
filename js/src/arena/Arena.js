SRJS.Arena = function( args ){

	if( typeof args === 'undefined' ){
		
		this.scene = new THREE.Scene();
		this.init = function(){
			console.error('No arguments passed to SRJS.Arena()');
		};
		
	} else {
		
		this.args = args;
		this.scene = args.scene || new THREE.Scene();
		
		this.robot = new SRJS.Robot();
		this.scene.addObject( this.robot );
		
		this.init = args.init || function(){
			console.error('Incomplete arguments passed to SRJS.Arena() - missing init');
		};
		this.renderer = args.renderer || function(){
			console.error('Incomplete arguments passed to SRJS.Arena() - missing renderer');
		};
		this.camera = args.camera || function(){
			console.error('Incomplete arguments passed to SRJS.Arena() - missing camera');
		};
		this.stats = args.stats || function(){
			console.error('Incomplete arguments passed to SRJS.Arena() - missing stats');
		};
		
		this.animate = function(){
			SRJS.CURRENT_ARENA.robot.move();
			requestAnimationFrame( SRJS.CURRENT_ARENA.animate );
			SRJS.CURRENT_ARENA.render();
			
			SRJS.CURRENT_ARENA.stats.update();
		};
		
		this.render = function(){
			var arena = SRJS.CURRENT_ARENA;
			
			if( SRJS.floatyCam ){
				arena.renderer.render( arena.scene, arena.camera );
			} else {
				arena.renderer.render( arena.scene, arena.robot.camera );
			}
			
			arena.robot.vision.update( arena.renderer );
		};
		
		SRJS.CURRENT_ARENA = this;
		
		this.animate();
	
	}
	
};
