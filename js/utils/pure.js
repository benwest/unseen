var m = require('mithril');

var shallowEqual = ( o1, o2 ) => {
    var keys = Object.keys( o1 );
    if ( keys.length !== Object.keys( o2 ).length ) return false;
    for ( var key of keys ) {
        if ( o1[ key ] !== o2[ key ] ) return false;
    }
    return true;
}

module.exports = Component => ({
    onbeforeupdate: ({ attrs }, { attrs: oldAttrs }) => !shallowEqual( attrs, oldAttrs ),
    view: ({ attrs, children }) => m( Component, attrs, children )
})