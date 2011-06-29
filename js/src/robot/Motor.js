SRJS.Motor = function(){

	this.max = 100;
	this._target = 0;

};

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Working_with_Objects#Defining_Getters_and_Setters
SRJS.Motor.prototype.__defineGetter__('target',
	function(){
		return this._target;
	}
);
SRJS.Motor.prototype.__defineSetter__('target',
	function( value ){
		if( value > this.max ){
			this._target = this.max;
		} else if ( value < -this.max ){
			this._target = -this.max;
		} else {
			this._target = value;
		}
	}
);


