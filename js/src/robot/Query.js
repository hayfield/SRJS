SRJS.Query = function( bindingObject, val ){
	if( typeof bindingObject !== 'object' ){
		return;
	}
	console.log(this);
	this.setUpQuery = function( bindingObject, obj ){
		obj = bindingObject;
		// ensure that the parameters are valid
		if( typeof obj !== 'object' ||
			(obj && (typeof obj.prop === 'undefined' ||
						typeof obj.type !== 'string' ||
						typeof obj.val == 'undefined'))){
			return;
		}
		if( obj.type !== 'eq' && obj.type !== 'gt' && obj.type !== 'lt' ){
			console.error( 'The type of Query must be one of the following:\n',
								'eq, gt, lt');
			return;
		}

		var comparison = obj.type === 'eq' ? '===' : obj.type === 'gt' ? '>' : '<';
		var watcherActivation = function( newval ){
			// is there a DRY way to do this without using eval()? function re-writing?
			if( eval( newval + comparison + obj.val ) ){
				SRJS.unwatch( obj.prop );
				this.callback();
			}
		}.bind( this );
		
		var watcherHandler = function( id, oldval, newval ){
			watcherActivation( newval );
			return newval;
		};
		SRJS.watch( obj.prop, watcherHandler );
	};
	
	this.setUpQuery( bindingObject, val );
	
};

SRJS.Query.prototype.eq = function( first, second ){
	return first === second
};

SRJS.Query.prototype.gt = function( first, second ){
	return first > second
};

SRJS.Query.prototype.lt = function( first, second ){
	return first < second
};