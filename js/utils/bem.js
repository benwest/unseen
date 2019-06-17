module.exports = ( be, ms = {} ) => {
    return [ be, ...Object.keys( ms )
        .filter( key => ms[ key ] )
        .map( key => be + '--' + key )
    ].join(' ');
}