SRJS.Motor = function(){

	this.max = 100;
	this._target = 0;

};

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


