var autobind = vnode => {
    for ( var key in vnode.state ) {
        if ( typeof vnode.state[ key ] === 'function' ) {
            vnode.state[ key ] = vnode.state[ key ].bind( vnode.state, vnode );
        }
    }
}

module.exports = arg => {
    if ( typeof arg === 'function' ) {
        return vnode => {
            autobind( vnode );
            arg( vnode );
        }
    }
    autobind( arg );
}