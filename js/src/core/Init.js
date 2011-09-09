SRJS.Init = function(){
	
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	SRJS.intersections = new SRJS.Physics.Intersections();
	SRJS.phys = new SRJS.Physics.Environment();
	var bob = new SRJS.Arena2011();
	
};
