SRJS.Vision = function(){
	if( SRJS.CURRENT_ARENA.visionVersion === 1 ){
		return new SRJS.VisionV1();
	} else {
		return new SRJS.VisionV2();
	}
};
