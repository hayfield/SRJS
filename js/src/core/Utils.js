SRJS.isZero = function( value ){
	return Math.abs( value ) < 0.00000001;
};

SRJS.invokeRepeating = function( callback, initialDelay, repeatRate ){
	repeatRate = repeatRate || initialDelay;
	if( typeof callback !== 'function' || typeof initialDelay !== 'number' ){
		console.error('SRJS.invokeRepeating(callback, initialDelay[, repeatRate]) takes two parameters, plus an optionsal third.\n',
						'The first is the function which is to be repeated.\n',
						'The second is the delay before the function is called in milliseconds.\n',
						'The third is how often the function should be called after the initial delay.',
						'If not set, it defaults to the value given to initialDelay.\n\n',
						'The following parameters were provided:', arguments);
	} else {
		var repeating = function(){
			callback();
			window.setTimeout( repeating, repeatRate );
		};
		window.setTimeout( repeating, initialDelay );
	}
};

/*
	http://stackoverflow.com/questions/1759987/detect-variable-change-in-javascript/1760159#1760159
	https://gist.github.com/175649
	
	Seems to cause a couple of problems with Three.js when modifying Object.prototype.
	Need to manually add to the objects with properties that can be watched.
*/
SRJS.watch = function( prop, handler ){
	var thisReference = this;
	if( prop.indexOf('.') !== -1 ){
		var propertyArray = prop.split('.');
		prop = propertyArray.pop();
		thisReference = eval(propertyArray.join('.'));
	}
	var val = thisReference[prop],
	getter = function () {
			return val;
	},
	setter = function (newval) {
			return val = handler.call(thisReference, prop, val, newval);
	};
	if (delete thisReference[prop]) { // can't watch constants
			if (Object.defineProperty) // ECMAScript 5
					Object.defineProperty(thisReference, prop, {
							get: getter,
							set: setter,
							configurable: true
					});
			else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
					Object.prototype.__defineGetter__.call(thisReference, prop, getter);
					Object.prototype.__defineSetter__.call(thisReference, prop, setter);
			}
	}
};

SRJS.unwatch = function( prop ){
	var thisReference = this;
	if( prop.indexOf('.') !== -1 ){
		var propertyArray = prop.split('.');
		prop = propertyArray.pop();
		thisReference = eval(propertyArray.join('.'));
	}
	
	var val = thisReference[prop];
	delete thisReference[prop]; // remove accessors
	thisReference[prop] = val;
};
