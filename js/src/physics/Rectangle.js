SRJS.Physics.Rectangle = function( fixed, trigger, dimension, position ){
	
	SRJS.Physics.Polygon.call( this, fixed, trigger );
	
	console.log( 'rect', position.x, position.y, dimension.x, dimension.y );
	
	var topLeft = new THREE.Vector2( position.x - (dimension.x / 2),
									 position.y - (dimension.y / 2) );
	var topRight = new THREE.Vector2( position.x + (dimension.x / 2),
									  position.y - (dimension.y / 2) );
	var bottomLeft = new THREE.Vector2( position.x - (dimension.x / 2),
										position.y + (dimension.y / 2) );
	var bottomRight = new THREE.Vector2( position.x + (dimension.x / 2),
										 position.y + (dimension.y / 2) );
	
	// top
	/*this.addEdge( new SRJS.Physics.Edge( new THREE.Vector2(topLeft.x, topLeft.y),
										 new THREE.Vector2(topRight.x, topRight.y) ));
	// bottom
	this.addEdge( new SRJS.Physics.Edge( new THREE.Vector2(bottomLeft.x, bottomLeft.y),
										 new THREE.Vector2(bottomRight.x, bottomRight.y) ));
	// left
	this.addEdge( new SRJS.Physics.Edge( new THREE.Vector2(topLeft.x, topLeft.y),
										 new THREE.Vector2(bottomLeft.x, bottomLeft.y) ));
	// right
	this.addEdge( new SRJS.Physics.Edge( new THREE.Vector2(topRight.x, topRight.y),
										 new THREE.Vector2(bottomRight.x, bottomRight.y) ));
	this.addEdge(new SRJS.Physics.Edge(new THREE.Vector2(150,150), new THREE.Vector2(250,150)));
	this.addEdge(new SRJS.Physics.Edge(new THREE.Vector2(150,250), new THREE.Vector2(250,250)));
	this.addEdge(new SRJS.Physics.Edge(new THREE.Vector2(150,150), new THREE.Vector2(150,250)));
	this.addEdge(new SRJS.Physics.Edge(new THREE.Vector2(250,150), new THREE.Vector2(250,250)));*/
	this.addEdge( new SRJS.Physics.Edge( 150, 150, 250, 150 ));
	
};

SRJS.Physics.Rectangle.prototype = new SRJS.Physics.Polygon();
SRJS.Physics.Rectangle.prototype.constructor = SRJS.Physics.Rectangle;
