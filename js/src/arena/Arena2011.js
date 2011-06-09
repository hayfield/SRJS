SRJS.Arena2011 = function(){
	
	args = {};
	
	var camera, scene, renderer,
    geometry, material, mesh, stats;

	args.initScene = function(){
		//camera = new THREE.Camera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
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
		pointLight.distance = 100000;
		pointLight.intensity = 0.5;
		scene.addLight( pointLight );

        geometry = new THREE.Cube( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
		
		var cube, cubeMesh, wall, position, rotation;
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
		
		// bob = new SRJS.Arena2011();
		
		
        mesh = new THREE.Mesh( geometry, material );
        scene.addObject( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );
 
		renderer.render( scene, camera );
		
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild( stats.domElement );
	};
	args.initScene();
	args.scene = scene;
	args.animate = function(){
		requestAnimationFrame( args.animate );
        args.render();
		
		stats.update();
	};
	args.render = function(){

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    };
	args.animate();
	
	console.log(args);
	
};
