SRJS.VisionV2 = function(){

	this.update = function(){
	
	};
	
	this.print_marker = function( marker ){
		if( marker instanceof SRJS.Marker ){
			marker.print();
		}
	};
	
	this.printMarker = this.print_marker;
	
};
