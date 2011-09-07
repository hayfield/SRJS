SRJS.Query = function( query ){
	var args = Array.prototype.slice.call(arguments);
	this.queryType = 'and';
	if( typeof query === 'string' ){
		if( ['and', 'or'].indexOf( query ) === -1 ){
			console.error( 'The type of query must be one of the following:\n',
								'and, or');
			return;
		}
		this.queryType = query;
		args = args.slice( 1 );
	} else if( typeof query !== 'object' ){
		return;
	}
	
	this.args = args;
	
	this.setUpQueries = function( arg ){
		arg.forEach(function( element, index, array ){
			this.setUpQuery( element, index );
		}, this);
	};
	
	this.queryStatuses = new Array();
	
	this.updateQueryStatus = function( index, value ){
		this.queryStatuses[index] = value;
		var valid = this.queryType === 'and' ? this.andCheck() : this.orCheck();
		if( valid ){
			this.callback();
			this.unbindWatchers();
		}
	};
	
	this.unbindWatchers = function(){
		this.args.forEach( function( element ){
			SRJS.unwatch( element.prop );
		}, this );
	};
	
	this.andCheck = function(){
		var i = 0;
		while( i < this.queryStatuses.length ){
			if( !this.queryStatuses[i] ) return false;
			i++;
		}
		return true;
	};
	
	this.orCheck = function(){
		var i = 0;
		while( i < this.queryStatuses.length ){
			if( this.queryStatuses[i] ) return true;
			i++;
		}
		return false;
	};
	
	this.setUpQuery = function( obj, index ){
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
		
		this.queryStatuses[index] = false;
		
		var comparison = obj.type === 'eq' ? '===' : obj.type === 'gt' ? '>' : '<';
		var watcherActivation = function( newval, index ){
			// is there a DRY way to do this without using eval()? function re-writing?
			if( eval( newval + comparison + obj.val ) ){
				this.updateQueryStatus( index, true );
			} else {
				this.updateQueryStatus( index, false );
			}
		}.bind( this );
		
		watcherActivation( eval( obj.prop ), index );
		
		var watcherHandler = function( id, oldval, newval ){
			watcherActivation( newval, index );
			return newval;
		};
		SRJS.watch( obj.prop, watcherHandler );
	};
	
	this.setUpQueries( args );
	
};
