SRJS.Arena2011 = function(){
	
	var args = {};
	
	var scene;

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
		
		SRJS.addPhysics = false;
		
		// the blue blobs around the arena
		for( i = 0; i < 27; i++ ){
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
		
		SRJS.addPhysics = true;
		
		// add the quadrant triggers
		var quadrantTrigger = function( robotID ){
			var robot = SRJS.CURRENT_ARENA.getRobot( robotID );
			
			if( robot.lastEnteredTrigger !== this ){
				robot.gameScore += 2;
				if( robot.cansOnBoard ){
					robot.gameScore += robot.cansOnBoard;
				}
				robot.lastEnteredTrigger = this;
			}

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

		this.scene = scene;
	};
	
	args.physics = SRJS.phys;
	
	args.arenaDimension = 800;
	
	args.robotStartPositions = [
									new SRJS.Vector2( 365, 365 ),
									new SRJS.Vector2( 365, -365 ),
									new SRJS.Vector2( -365, -365 ),
									new SRJS.Vector2( -365, 365 )
							   ];
	
	args.robotStartRotations = [ 0, Math.PI / 2, Math.PI, Math.PI * 1.5 ];
	
	var arena = new SRJS.Arena( args );
	
};
