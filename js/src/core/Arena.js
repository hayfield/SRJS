SRJS.Arena = function( args ){

	if( typeof args === 'undefined' ){
		
		this.scene = new THREE.Scene();
		
		this.init = function(){
			console.log('no arguments passed to SRJS.Arena()');
		};
		
	} else {
	
		this.scene = args.scene || new THREE.Scene();
		
		this.init = args.init || function(){
			console.log('incomplete arguments passed to SRJS.Arena() - missing init');
		};
	
	}
	
};
