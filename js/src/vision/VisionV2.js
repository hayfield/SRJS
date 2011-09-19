SRJS.VisionV2 = function( object ){
	
	this.object = object;
	
	var canvas = document.createElement('canvas'),
		vision = this;
	
	this.canvas = canvas;
	this.canvas.width = SRJS.CURRENT_ARENA.renderer.domElement.width;
	this.canvas.height = SRJS.CURRENT_ARENA.renderer.domElement.height;
	document.body.appendChild( this.canvas );
	this.context = this.canvas.getContext('2d');
	
	this.update = function( renderer ){
		var img = new Image();
		
		img.onload = function(){
			vision.context.clearRect( 0, 0, vision.canvas.width, vision.canvas.height );
			vision.context.drawImage( img, 0, 0 );
		};
		img.src = renderer.domElement.toDataURL('image/png');
	};
	
	this.print_marker = function( marker ){
		if( marker instanceof SRJS.Marker ){
			marker.print();
		}
	};
	
	this.printMarker = this.print_marker;
	
};
