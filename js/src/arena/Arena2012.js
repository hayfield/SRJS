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
										new THREE.Vector3( 0, 135, 297.5 )
									) );
		scene.addObject( new SRJS.Wall( 600, 20, 5,
										new THREE.Vector3( 297.5, 135, 0 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		scene.addObject( new SRJS.Wall( 600, 20, 5,
										new THREE.Vector3( 0, 135, -297.5 )
									) );
		scene.addObject( new SRJS.Wall( 600, 20, 5,
										new THREE.Vector3( -297.5, 135, 0 ),
										new THREE.Vector3( 0, Math.PI / 2, 0 )
									) );
		
        // the feet along the inner walls (2 per side) that the robots will drive into
        // bottom
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( 150, 87.5, 297.5 )
									) );
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( -150, 87.5, 297.5 )
									) );
        // top
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( 150, 87.5, -297.5 )
									) );
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( -150, 87.5, -297.5 )
									) );
        // left
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( -297.5, 87.5, 150 )
									) );
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( -297.5, 87.5, -150 )
									) );
        // right
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( 297.5, 87.5, 150 )
									) );
        scene.addObject( new SRJS.Wall( 5, 75, 5,
										new THREE.Vector3( 297.5, 87.5, -150 )
									) );
        
        // add the markers around the edges of the arena
        // start in the top-left corner on the right wall and work round anti-clockwise
        var i, marker;
        for( i = 0; i < 7; i++ ){
            // left
            marker = new SRJS.Trigger( 1, 25, 25,
                                    new THREE.Vector3( -400, 67.5, -346 + i * (808/7) )
                                  );
            SRJS.CreateMarker( marker, i + 14, SRJS.MARKER_ARENA );
            scene.addObject( marker );
            
            // bottom
            marker = new SRJS.Trigger( 25, 25, 1,
                                    new THREE.Vector3( -346 + i * (808/7), 67.5, 400 )
                                  );
            SRJS.CreateMarker( marker, i + 7, SRJS.MARKER_ARENA );
            scene.addObject( marker );
            
            // right
            marker = new SRJS.Trigger( 1, 25, 25,
                                    new THREE.Vector3( 400, 67.5, 346 - i * (808/7) )
                                  );
            SRJS.CreateMarker( marker, i, SRJS.MARKER_ARENA );
            scene.addObject( marker );
            
            // top
            marker = new SRJS.Trigger( 25, 25, 1,
                                    new THREE.Vector3( 346 - i * (808/7), 67.5, -400 )
                                  );
            SRJS.CreateMarker( marker, i + 21, SRJS.MARKER_ARENA );
            scene.addObject( marker );
        }
        
		// add the boxes in the middle of the arena
		var box, boxAction, bucket;
		boxAction = function( robotID ){
			var robot = SRJS.CURRENT_ARENA.robots[robotID - 1];
			robot.gameSettings.carriedBoxes = typeof robot.gameSettings.carriedBoxes === 'undefined' ? 1 : robot.gameSettings.carriedBoxes + 1;
			SRJS.phys.removePolygon( this );
			scene.removeObject( this );
		};
		for( i = 0; i < 20; i++ ){
			box = new SRJS.Trigger( 11, 11, 11,
								new THREE.Vector3( Math.random() * 520 - 240, 55.5, Math.random() * 520 - 240 ),
								new THREE.Vector3( 0, 0, 0 ),
								boxAction
								);
			SRJS.CreateMarker( box, 32 + i, SRJS.MARKER_TOKEN );
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
			bucket = new SRJS.Pushable( 24.5, 100, 37.2,
										bucketPositions[i],
										new THREE.Vector3( 0, 0, 0 )
									);
			SRJS.CreateMarker( bucket, 72 + i, SRJS.MARKER_BUCKET );
			scene.addObject( bucket );
		}
		
		this.scene = scene;
	};
	
	args.physics = SRJS.phys;
	
	args.arenaDimension = 800;
	
	args.robotStartPositions = [
									new SRJS.Vector2( -365, 100 ),
									new SRJS.Vector2( 100, 365 ),
									new SRJS.Vector2( 365, -100 ),
									new SRJS.Vector2( -100, -365 )
							   ];
	
	args.robotStartRotations = [ Math.PI * 1.5, 0, Math.PI / 2, Math.PI ];
	
	args.visionVersion = 2;
	
	return new SRJS.Arena( args );
	
};
