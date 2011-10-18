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
        var objID = 0;
		this.args.forEach( function( element, index ){
            if( typeof element === 'object' ){
                this.watchers[objID]( eval( element.prop ), index );
                objID++;
            }
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
                this.setUpQuery( element, index );
			} else if( typeof element === 'number' ){
                this.setUpTimeout( element, index );
            }
		}, this);
	};
	
	this.queryStatuses = new Array();
	this.timeoutIDs = new Array();
    
    this.parseValues = function( index, newval ){
        var a = 0,
            values = [];
        while( a < this.args.length ){
            if( this.queryStatuses[a] ){
                // if the query is a timeout, push a boolean indicating that it's finished
                if( typeof this.args[a] === 'number' ){
                    values.push( true );
                } else {
                    values.push( eval(this.args[a].prop) );
                }
            } else {
                // push null if the query isn't true
                values.push( null );
            }
            a++;
        }
        if( typeof index !== 'undefined' && typeof newval !== 'undefined' ){
            values[index] = newval;
        }
        return values;
    };
	
	this.updateQueryStatus = function( index, value, newval ){
		this.queryStatuses[index] = value;
		var valid = this.queryType === 'and' ? this.andCheck() : this.orCheck();
		if( valid && !this.unboundWatchers ){
			this.unbindWatchers();
			this.callback( this.parseValues( index, newval ) );
			return true;
		}
		return false;
	};
	
	this.unbindWatchers = function(){
		this.args.forEach( function( element ){
            if( typeof element === 'object' ){
                SRJS.unwatch( element.prop );
            }
		}, this );
        
        this.timeoutIDs.forEach( function( ID ){
            window.clearTimeout( ID );
        }, this );
        
        this.unboundWatchers = true;
	};
    
    this.unboundWatchers = false;
	
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
    
    this.setUpTimeout = function( time, index ){
        this.queryStatuses[index] = false;
        var timeoutID = window.setTimeout(function(){
            this.updateQueryStatus( index, true );
        }.bind( this ), time * 1000);
        
        this.timeoutIDs.push( timeoutID );
    };
	
	this.setUpQuery = function( obj, index ){
		// ensure that the parameters are valid
		if( typeof obj !== 'object' ||
			(obj && (typeof obj.prop === 'undefined' ||
						typeof obj.type !== 'string' ||
						typeof obj.val == 'undefined'))){
			return;
		}
		
		var inputTypes = ['eq', 'gt', 'lt', 'ne', 'lte', 'gte'];
		var outputTypes = ['===', '>', '<', '!==', '<=', '>='];
		if( inputTypes.indexOf( obj.type ) === -1 ){
			console.error( 'The type of Query must be one of the following:\n',
								'eq, gt, lt, ne, lte, gte');
			return;
		}
		
		this.queryStatuses[index] = false;
		
		var comparison = outputTypes[ inputTypes.indexOf( obj.type ) ];
		var watcherActivation = function( newval, index ){
			var unbound = false;
			// is there a DRY way to do this without using eval()? function re-writing?
			if( eval( newval + comparison + obj.val ) ){
				unbound = this.updateQueryStatus( index, true, newval );
			} else {
				this.updateQueryStatus( index, false, newval );
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
