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
	
	this.watchers = new Array();
	this.callWatchers = function(){
		this.args.forEach( function( element, index ){
			this.watchers[index]( eval( element.prop ), index );
		}, this );
	};
	
	this.setUpQueries = function( arg ){
		arg.forEach(function( element, index ){
			if( element instanceof Array && element.length === 3 &&
					typeof element[0] === 'string' && typeof element[1] === 'string' ){
				var obj = {
					prop: element[0],
					type: element[1],
					val: element[2]
				};
				element = obj;
				arg[index] = obj;
			}
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
			return true;
		}
		return false;
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
			var unbound = false;
			// is there a DRY way to do this without using eval()? function re-writing?
			if( eval( newval + comparison + obj.val ) ){
				unbound = this.updateQueryStatus( index, true );
			} else {
				this.updateQueryStatus( index, false );
			}
			return unbound;
		}.bind( this );
		
		this.watchers.push( watcherActivation );
		
		var watcherHandler = function( id, oldval, newval ){
			var unbound = watcherActivation( newval, index );
			/*
				Without checking to see if things are unbound, the logic goes as follows when the query becomes true:
					Reach assignment that turns the query true
					Do the various updating calls from the handler
					Unwatch the variable being assigned
					The setter no longer exists, so returning newval doesn't cause the value to update
				Manually setting the value ensures that it's set
			*/
			if( unbound ){
				this[id] = newval;
			}
			return newval;
		};
		SRJS.watch( obj.prop, watcherHandler );
	};
	
	this.setUpQueries( args );
	
};
