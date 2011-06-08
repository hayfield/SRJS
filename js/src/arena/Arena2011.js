SRJS.Arena2011 = function(){
	
	args = {};
	
	var camera, scene, renderer,
    geometry, material, mesh;

	args.initScene = function(){
		//camera = new THREE.Camera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		camera = new THREE.QuakeCamera( {
 
					fov: 50, aspect: window.innerWidth / window.innerHeight, near: 1, far: 20000,
					constrainVertical: true, verticalMin: 1.1, verticalMax: 2.2,
					movementSpeed: 1000, lookSpeed: 0.125, noFly: false, lookVertical: true, autoForward: false
 
				} );
        camera.position.z = 1000;

        scene = new THREE.Scene();

        geometry = new THREE.Cube( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
		
		var cube, cubeMesh, wall, position, rotation;
		// floor
		scene.addObject( new SRJS.Wall( 800, 100, 800 ) );
		//scene.addObject( new THREE.Mesh( new THREE.Cube( 800, 100, 800 ), SRJS.Material.white ) );
		// 4 walls
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
		/*
		cube = new THREE.Cube( 100, 60, 1000 );
		cubeMesh = new THREE.Mesh( cube, SRJS.Material.red );
		cubeMesh.position.x = 450;
		cubeMesh.position.y = 80;
		scene.addObject( cubeMesh );
		cube = new THREE.Cube( 100, 60, 1000 );
		cubeMesh = new THREE.Mesh( cube, SRJS.Material.red );
		cubeMesh.position.x = -450;
		cubeMesh.position.y = 80;
		scene.addObject( cubeMesh );
		cube = new THREE.Cube( 100, 60, 1000 );
		cubeMesh = new THREE.Mesh( cube, SRJS.Material.blue );
		cubeMesh.position.z = -450;
		cubeMesh.position.y = 80;
		cubeMesh.rotation.y = Math.PI / 2;
		scene.addObject( cubeMesh );
		cube = new THREE.Cube( 100, 60, 1000 );
		cubeMesh = new THREE.Mesh( cube, SRJS.Material.blue );
		cubeMesh.position.z = 450;
		cubeMesh.position.y = 80;
		cubeMesh.rotation.y = Math.PI / 2;
		scene.addObject( cubeMesh );
		*/
		
        mesh = new THREE.Mesh( geometry, material );
        scene.addObject( mesh );

        renderer = new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );
 
		renderer.render( scene, camera );
	};
	args.initScene();
	args.scene = scene;
	args.animate = function(){
		requestAnimationFrame( args.animate );
        args.render();
	};
	args.render = function(){

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    };
	args.animate();
	
	console.log(args);
	
};
