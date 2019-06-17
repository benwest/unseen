var listeners = [];

var emit = ( ...args ) => listeners.forEach( fn => fn( ...args ) );
var on = fn => listeners.push( fn );
var off = fn => {
    var idx = listeners.indexOf( fn );
    if ( idx > -1 ) listeners.splice( idx, 1 );
}

module.exports = { emit, on, off };