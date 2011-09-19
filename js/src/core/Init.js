SRJS.Init = function( year ){
	
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	SRJS.intersections = new SRJS.Physics.Intersections();
	SRJS.phys = new SRJS.Physics.Environment();
	
	if( year === 2011 ){
		var bob = new SRJS.Arena2011();
	} else {
		var bob = new SRJS.Arena2012();
	}
	
};
