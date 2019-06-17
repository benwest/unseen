var { map, clamp } = require('./math');

module.exports = keyframes => {
    var maps = [];
    for ( var i = 0; i < keyframes.length - 1; i++ ) {
        maps.push([
            keyframes[ i ][ 0 ],
            keyframes[ i + 1 ][ 0 ],
            keyframes[ i ][ 1 ],
            keyframes[ i + 1 ][ 1 ],
        ])
    }
    var min = maps[ 0 ][ 0 ];
    var max = maps[ maps.length - 1 ][ 1 ];
    return t => {
        t = clamp( t, min, max );
        for ( var i = 0; i < maps.length; i++ ) {
            var [ start, end, from, to ] = maps[ i ];
            if ( t >= start && t <= end ) return map( t, start, end, from, to );
        }
    }
}