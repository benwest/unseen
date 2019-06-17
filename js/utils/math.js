var clamp = ( x, min = 0, max = 1 ) => Math.min( Math.max( x, Math.min( max, min ) ), Math.max( max, min ) );
var lerp = ( a, b, t ) => a + ( b - a ) * t;
var smoothstep = ( x, min, max ) => ( x - min ) / ( max - min );
var map = ( x, oldMin, oldMax, newMin, newMax ) =>
    lerp( newMin, newMax, smoothstep( x, oldMin, oldMax ) );
var cmap = ( x, oldMin, oldMax, newMin, newMax ) =>
    clamp( map( x, oldMin, oldMax, newMin, newMax ), newMin, newMax )

var fit = fn => ( src, dest ) => {
    var scale = fn( dest[ 0 ] / src[ 0 ], dest[ 1 ] / src[ 1 ] );
    return [ src[ 0 ] * scale, src[ 1 ] * scale ];
}
var cover = fit( Math.max );
var contain = fit( Math.min );

module.exports = { clamp, lerp, smoothstep, map, cmap, cover, contain };