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
		this.context.clearRect( 0, 0, vision.canvas.width, vision.canvas.height );
		this.context.drawImage( renderer.domElement, 0, 0 );
	};
	
	this.print_marker = function( marker ){
		if( marker instanceof SRJS.Marker ){
			marker.print();
		}
	};
	
	this.printMarker = this.print_marker;
    
    this.see = function( width, height ){
        var markers = new Array(),
			i = 0,
			marker;
        
        width = typeof width != 'undefined' ? width : 800;
        height = typeof height != 'undefined' ? height : 600;
        
        while( i < SRJS.markers.length ){
			marker = SRJS.markers[i].update( this.object, width, height );
			if( (marker.centre.polar.rot_x < this.object.camera.fov / 2 || marker.centre.polar.rot_x > 360 - this.object.camera.fov / 2) 
                    && marker.object !== robot ){
				markers.push( marker );
			}
			i++;
		}
		
		return markers;
    };
	
};
