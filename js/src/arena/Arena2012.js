SRJS.Arena2012 = function(){
	
	var args = {}, scene;

	args.initScene = function(){
		
        scene = new THREE.Scene();
		
		var i, ambient, directionalLight, pointLight;
		
		ambient = new THREE.AmbientLight( 0xffffff );
		scene.addLight( ambient );
 
		directionalLight = new THREE.DirectionalLight( 0xff0000 );
		directionalLight.position.y = 200;
		directionalLight.position.normalize();
		scene.addLight( directionalLight );
 
		pointLight = new THREE.PointLight( 0xff0000 );
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
		
		// 4 inner walls (that robots can get under, but buckets can't)
		scene.addObject( new SRJS.Wall( 600, 20, 5,
										new THREE.Vector3( 0, 120, 297.5 )
									) );
		scene.addObject( new SRJS.Wall( 600, 20, 5,
										new THREE.Vector3( 297.5, 120, 0 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		scene.addObject( new SRJS.Wall( 600, 20, 5,
										new THREE.Vector3( 0, 120, -297.5 )
									) );
		scene.addObject( new SRJS.Wall( 600, 20, 5,
										new THREE.Vector3( -297.5, 120, 0 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		
        // the feet along the inner walls (2 per side) that the robots will drive into
        // bottom
        scene.addObject( new SRJS.Wall( 5, 60, 5,
										new THREE.Vector3( 150, 80, 297.5 )
									) );
        scene.addObject( new SRJS.Wall( 5, 60, 5,
										new THREE.Vector3( -150, 80, 297.5 )
									) );
        // top
        scene.addObject( new SRJS.Wall( 5, 60, 5,
										new THREE.Vector3( 150, 80, -297.5 )
									) );
        scene.addObject( new SRJS.Wall( 5, 60, 5,
										new THREE.Vector3( -150, 80, -297.5 )
									) );
        // left
        scene.addObject( new SRJS.Wall( 5, 60, 5,
										new THREE.Vector3( -297.5, 80, 150 )
									) );
        scene.addObject( new SRJS.Wall( 5, 60, 5,
										new THREE.Vector3( -297.5, 80, -150 )
									) );
        // right
        scene.addObject( new SRJS.Wall( 5, 60, 5,
										new THREE.Vector3( 297.5, 80, 150 )
									) );
        scene.addObject( new SRJS.Wall( 5, 60, 5,
										new THREE.Vector3( 297.5, 80, -150 )
									) );
        
		// add the boxes in the middle of the arena
		var i, box, boxAction, bucket;
		boxAction = function( robotID ){
			var robot = SRJS.CURRENT_ARENA.robots[robotID - 1];
			robot.gameSettings.carriedBoxes = typeof robot.gameSettings.carriedBoxes === 'undefined' ? 1 : robot.gameSettings.carriedBoxes + 1;
			SRJS.phys.removePolygon( this );
			scene.removeObject( this );
		};
		for( i = 0; i < 20; i++ ){
			box = new SRJS.Trigger( 10, 10, 10,
								new THREE.Vector3( Math.random() * 520 - 240, 60, Math.random() * 520 - 240 ),
								new THREE.Vector3( 0, 0, 0 ),
								boxAction
								);
			SRJS.CreateMarker( box, 'box' + i );
			scene.addObject( box );
		}
		
		// add the buckets
		var bucketPositions = [
			new THREE.Vector3( 0, 100, 350 ),
			new THREE.Vector3( 350, 100, 0 ),
			new THREE.Vector3( 0, 100, -350 ),
			new THREE.Vector3( -350, 100, 0 )
		];
		for( i = 0; i < 4; i++ ){
			bucket = new SRJS.Pushable( 50, 100, 50,
										bucketPositions[i],
										new THREE.Vector3( 0, 0, 0 )
									);
			SRJS.CreateMarker( bucket, 'bucket' + i );
			scene.addObject( bucket );
		}
		
		this.scene = scene;
	};
	
	args.physics = SRJS.phys;
	
	args.arenaDimension = 800;
	
	args.robotStartPositions = [
									new SRJS.Vector2( 100, 365 ),
									new SRJS.Vector2( 365, -100 ),
									new SRJS.Vector2( -100, -365 ),
									new SRJS.Vector2( -365, 100 )
							   ];
	
	args.robotStartRotations = [ 0, Math.PI / 2, Math.PI, Math.PI * 1.5 ];
	
	args.visionVersion = 2;
	
	return new SRJS.Arena( args );
	
};
