SRJS.Arena2011 = function(){
	
	args = {};
	
	var camera, scene, renderer,
    geometry, material, mesh;

	args.initScene = function(){
		camera = new THREE.Camera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

        scene = new THREE.Scene();

        geometry = new THREE.Cube( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

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
