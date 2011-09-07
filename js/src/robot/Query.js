SRJS.Query = function( bindingObject, val ){
	if( typeof bindingObject !== 'object' ){
		return;
	}
	console.log(this);
	this.setUpQuery = function( bindingObject, obj ){
		obj = bindingObject;
		console.log(this);
		console.log('setting up query', bindingObject, bindingObject.prop, eval(bindingObject.prop), obj);
		robot.io.bumpSensor[0].d = true;
		console.log('setting up query', bindingObject, bindingObject.prop, eval(bindingObject.prop), obj);
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
		var query = this;
		var comparison = obj.type === 'eq' ? '===' : obj.type === 'gt' ? '>' : '<';
		var callback = function( newval ){
			// is there a DRY way to do this without using eval()? function re-writing?
			if( eval( newval + comparison + obj.val ) ){
				console.log('comparison activated', this, newval, comparison, obj.val, ':', eval(obj.prop));
				//if( count > 2 ){
				robot.motor[0].target = -100;
				robot.motor[1].target = -100;
				robot.yield(3);
				SRJS.unwatch( obj.prop );
				//}
				//count++;
				console.log('count', count);
				
			}
		};
		var watcherHandler = function( id, oldval, newval ){
			callback( newval );
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
