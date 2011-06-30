var debugCanvas, debugContext;

SRJS.Init = function(){
	
	debugCanvas = document.getElementById('visionDebug');
	debugContext = debugCanvas.getContext('2d');
	console.log('found debug canvas');
	
};
