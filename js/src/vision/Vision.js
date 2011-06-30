SRJS.Vision = function(){

	this.blobs = new Array();
	
	var canvas = document.createElement('canvas');
	this.canvas = canvas;
	this.canvas.width = window.innerWidth / 2;
	this.canvas.height = window.innerHeight / 2;
	document.body.appendChild( this.canvas );
	this.context = this.canvas.getContext('2d');
	
	this.update = function( renderer ){
		var img = new Image();
		var vision = this;
		img.onload = function(){
			vision.context.clearRect( 0, 0, vision.canvas.width, vision.canvas.height );
			vision.context.drawImage( img, 0, 0 );
			var imageData = vision.processData( vision.getImageData( vision.context ));
			vision.context.putImageData( imageData, 0, 0 );
			vision.detectBlobs( imageData );
		};
		img.src = renderer.domElement.toDataURL('image/png');
	};
	
	this.detectBlobs = function( imgData ){
		// imgData should already have been run through this.processData()
		console.log(imgData.height, imgData.width);
	};

};

SRJS.Vision.prototype.blueMin = 235;
SRJS.Vision.prototype.blueMax = 255;
SRJS.Vision.prototype.greenMin = 115;
SRJS.Vision.prototype.greenMax = 125;
SRJS.Vision.prototype.redMin = -1;
SRJS.Vision.prototype.redMax = 10;
SRJS.Vision.prototype.redSaturationMin = 0.9;

SRJS.Vision.prototype.processData = function( imgData ){
	var hsv = {};
	var dataLength = imgData.data.length / 4; // rgba
	imgData.colors = new Array();
	
	for( var i = 0; i < dataLength; i++ ){
		// convert the rgb data to hsv
		hsv = SRJS.Vision.prototype.rgbToHsv( imgData.data[i*4],
							imgData.data[i*4 + 1],
							imgData.data[i*4 + 2],
							hsv );
		
		// check to see if the value is within the required range for each color
		if( hsv.h > SRJS.Vision.prototype.blueMin
				&& hsv.h < SRJS.Vision.prototype.blueMax ){
			// show as white
			imgData.data[i*4] = imgData.data[i*4 + 1] = imgData.data[i*4 + 2] = 255;
			imgData.colors[i] = SRJS.BLUE;
		} else if ( hsv.h > SRJS.Vision.prototype.greenMin
				&& hsv.h < SRJS.Vision.prototype.greenMax ){
			// show as a lightish grey
			imgData.data[i*4] = imgData.data[i*4 + 1] = imgData.data[i*4 + 2] = 170;
			imgData.colors[i] = SRJS.GREEN;
		} else if ( hsv.s > SRJS.Vision.prototype.redSaturationMin
				&& hsv.h > SRJS.Vision.prototype.redMin
				&& hsv.h < SRJS.Vision.prototype.redMax ){
			// show as a darkish grey
			imgData.data[i*4] = imgData.data[i*4 + 1] = imgData.data[i*4 + 2] = 100;
			imgData.colors[i] = SRJS.RED;
		} else {
			// show as a dark grey
			imgData.data[i*4] = imgData.data[i*4 + 1] = imgData.data[i*4 + 2] = 40;
			imgData.colors[i] = SRJS.NOTHING;
		}
	}
	
	return imgData;
};

SRJS.Vision.prototype.getImageData = function( canvasContext, x, y, width, height ){
	var imgData,
	x = x || 0,
	y = y || 0;
	width = width || canvasContext.canvas.width;
	height = height || canvasContext.canvas.height;
	
	// http://blog.project-sierra.de/archives/1577
	// http://stackoverflow.com/questions/4121142/javascript-getimagedata-for-canvas-html5
	try {
		try { 
			imgData = canvasContext.getImageData( x, y, width, height );
		} catch( e ) { 
			netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
			imgData = canvasContext.getImageData( x, y, width, height );
		}						  
	} catch ( e ) {
		throw new Error('Unable to access image data: ' + e);
	}

	return imgData;
};

// http://cs.haifa.ac.il/hagit/courses/ist/Lectures/Demos/ColorApplet2/t_convert.html
SRJS.Vision.prototype.rgbToHsv = function( r, g, b, hsv ){
	var hsv = hsv || {};
	var min, max, delta;
	
	min = Math.min( r, g, b );
	max = Math.max( r, g, b );
	hsv.v = max;
	
	delta = max - min;
	if( max !== 0 ){
		hsv.s = delta / max;
	} else {
		// r = g = b = 0
		hsv.s = 0;
		hsv.h = -1;
		return hsv;
	}
	
	if( r === max ){
		// between yellow and magenta
		hsv.h = ( g - b ) / delta;
	} else if ( g === max ){
		// between cyan and yellow
		hsv.h = 2 + ( b - r ) / delta;
	} else {
		// between magenta and cyan
		hsv.h = 4 + ( r - g ) / delta;
	}
	
	hsv.h *= 60;
	if( hsv.h < 0 ){
		hsv.h += 360;
	}
	
	return hsv;
};

SRJS.Vision.prototype.hsvToRgb = function( h, s, v ){
	var rgb = {};
	var i, f, p, q, t;
	
	if( s === 0 ){
		// grey
		rgb.r = rgb.g = rgb.b = v;
		return rgb;
	}
	
	h /= 60;
	i = Math.floor( h );
	f = h - i;
	p = v * ( 1 - s );
	q = v * ( 1 - s * f );
	t = v * ( 1 - s * ( 1 - f ) );
	
	switch( i ) {
		case 0:
			rgb.r = v;
			rgb.g = t;
			rgb.b = p;
			break;
		case 1:
			rgb.r = q;
			rgb.g = v;
			rgb.b = p;
			break;
		case 2:
			rgb.r = p;
			rgb.g = v;
			rgb.b = t;
			break;
		case 3:
			rgb.r = p;
			rgb.g = q;
			rgb.b = v;
			break;
		case 4:
			rgb.r = t;
			rgb.g = p;
			rgb.b = v;
			break;
		default:		// case 5:
			rgb.r = v;
			rgb.g = p;
			rgb.b = q;
			break;
	}
	
	return rgb;
};
