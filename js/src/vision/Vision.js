SRJS.Vision = function(){

	this.blobs = new Array();

};

// http://cs.haifa.ac.il/hagit/courses/ist/Lectures/Demos/ColorApplet2/t_convert.html
SRJS.Vision.prototype.rgbToHsv = function( r, g, b ){
	var hsv = {};
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
		case 2
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
