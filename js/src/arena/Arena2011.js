SRJS.Arena2011 = function(){
	
	var args = {};
	
	var camera, scene, renderer, rendererContext, stats, container;

	args.initScene = function(){
		
		container = document.createElement('div');
		document.body.appendChild( container );
		camera = new THREE.QuakeCamera( {
					fov: 50, aspect: window.innerWidth / window.innerHeight, near: 1, far: 20000,
					constrainVertical: true, verticalMin: 1.1, verticalMax: 2.2,
					movementSpeed: 1000, lookSpeed: 0.125, noFly: false, lookVertical: true, autoForward: false
 
				} );
        camera.position.y = 100;

        scene = new THREE.Scene();
		
		var ambient = new THREE.AmbientLight( 0xffffff );
		scene.addLight( ambient );
 
		var directionalLight = new THREE.DirectionalLight( 0xff0000 );
		directionalLight.position.y = 200;
		directionalLight.position.normalize();
		scene.addLight( directionalLight );
 
		var pointLight = new THREE.PointLight( 0xff0000 );
		pointLight.position.y = 150;
		pointLight.position.x = -250;
		pointLight.position.z = -250;
		pointLight.intensity = 0.5;
		scene.addLight( pointLight );

		// floor
		scene.addObject( new SRJS.Wall( 800, 100, 800 ) );

		// 4 outer walls
		scene.addObject( new SRJS.Wall( 100, 60, 1000, new THREE.Vector3( 450, 80, 0 ) ) );
		scene.addObject( new SRJS.Wall( 100, 60, 1000, new THREE.Vector3( -450, 80, 0 ) ) );
		scene.addObject( new SRJS.Wall( 100, 60, 1000,
										new THREE.Vector3( 0, 80, -450 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		scene.addObject( new SRJS.Wall( 100, 60, 1000,
										new THREE.Vector3( 0, 80, 450 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		// eight inner walls
		// the large section
		// two long walls
		scene.addObject( new SRJS.Wall( 400, 20, 5,
										new THREE.Vector3( 0, 60, 197.5 )
									) );
		scene.addObject( new SRJS.Wall( 400, 20, 5,
										new THREE.Vector3( 197.5, 60, 0 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		// two short walls connecting the long ones
		scene.addObject( new SRJS.Wall( 100, 20, 5,
										new THREE.Vector3( 150, 60, -197.5 )
									) );
		scene.addObject( new SRJS.Wall( 100, 20, 5,
										new THREE.Vector3( -197.5, 60, 150 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		// diagonal wall to complete this section
		scene.addObject( new SRJS.Wall( 425, 20, 5,
										new THREE.Vector3( -48.1, 60, -48.1 ),
										new THREE.Vector3( 0, Math.PI / 4, 0 )
									) );
									
		// the smaller triangle
		// two straight walls
		scene.addObject( new SRJS.Wall( 200, 20, 5,
										new THREE.Vector3( -100, 60, -197.5 )
									) );
		scene.addObject( new SRJS.Wall( 200, 20, 5,
										new THREE.Vector3( -197.5, 60, -100 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		// the diagonal to close off this triangle
		scene.addObject( new SRJS.Wall( 276, 20, 5,
										new THREE.Vector3( -99.3, 60, -99.3 ),
										new THREE.Vector3( 0, Math.PI / 4, 0 )
									) );
		
		// the blue blobs around the arena
		for( var i = 0; i < 27; i++ ){
			// one long side
			scene.addObject( new SRJS.Cube( 4.9,
										new THREE.Vector3( 197.4 - i * 15, 52.45, 197.57 ),
										SRJS.Material.blue
									) );
			// the other long side
			scene.addObject( new SRJS.Cube( 4.9,
										new THREE.Vector3( 197.57, 52.45, -197.4 + i * 15 ),
										SRJS.Material.blue
									) );
			var height = i < 14 && i > 6 ? 47.57 : 52.45;
			// one broken side
			scene.addObject( new SRJS.Cube( 4.9,
										new THREE.Vector3( 197.4 - i * 15, height, -197.57 ),
										SRJS.Material.blue
									) );
			// the other broken side
			scene.addObject( new SRJS.Cube( 4.9,
										new THREE.Vector3( -197.57, height, 197.4 - i * 15 ),
										SRJS.Material.blue
									) );
		}
		
		// add the quadrant triggers
		var quadrantTrigger = function(){
			console.log('Quadrant trigger has been triggered');
		};
		scene.addObject( new SRJS.Trigger( 300, 100, 1,
										new THREE.Vector3( -300, 100, 300 ),
										new THREE.Vector3( 0, Math.PI / 4, 0 ),
										quadrantTrigger
									) );
		scene.addObject( new SRJS.Trigger( 300, 100, 1,
										new THREE.Vector3( -300, 100, -300 ),
										new THREE.Vector3( 0, -Math.PI / 4, 0 ),
										quadrantTrigger
									) );
		scene.addObject( new SRJS.Trigger( 300, 100, 1,
										new THREE.Vector3( 300, 100, 300 ),
										new THREE.Vector3( 0, -Math.PI / 4, 0 ),
										quadrantTrigger
									) );
		scene.addObject( new SRJS.Trigger( 300, 100, 1,
										new THREE.Vector3( 300, 100, -300 ),
										new THREE.Vector3( 0, Math.PI / 4, 0 ),
										quadrantTrigger
									) );

        renderer = new THREE.WebGLRenderer();
        //renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
        renderer.setSize( 200, 200 );
        document.body.appendChild( renderer.domElement );
		
		rendererContext = renderer.domElement.getContext('experimental-webgl');
		
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild( stats.domElement );
		
		this.camera = camera;
		this.scene = scene;
		this.renderer = renderer;
		this.rendererContext = rendererContext;
		this.stats = stats;
		this.container = container;
	};
	
	args.initScene();
	
	var arena = new SRJS.Arena( args );
	
};
