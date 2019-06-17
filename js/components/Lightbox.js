var m = require('mithril');
var { contain } = require('../utils/math');

var Asset = require('./Asset');

var ensureTarget = ( fn, cls ) => e => {
    if ( e.target.classList.contains( cls ) ) fn( e );
}

module.exports = {
    oncreate: () => {
        document.body.classList.add('lightbox-open');
    },
    onbeforeremove: ({ dom, state }) => new Promise( resolve => {
        dom.addEventListener( 'animationend',  resolve );
        dom.classList.add( 'lightbox--exit' );
        document.body.classList.remove('lightbox-open');
    }),
    view: ({ attrs: { asset, close = () => {} } }) => {
        var maxSize = [ window.innerWidth * .8, window.innerHeight * .8 ];
        var size = contain( asset.size, maxSize );
        return m('.lightbox', { onclick: ensureTarget( close, 'lightbox' ) },
            m( Asset, {
                asset,
                muted: false,
                className: 'lightbox__asset',
                style: { width: size[ 0 ] + 'px', height: size[ 1 ] + 'px' }
            })
        )
    }
}

// var AboutVideo = {
//     onbeforeremove: ({ dom, state }) => new Promise( resolve => {
//         dom.addEventListener( 'animationend',  resolve );
//         dom.classList.add( 'about__video--exit' );
//     }),
//     view: ({ attrs: { onclick, video }}) => {
//         return m('.about__video', { onclick: ensureTarget( onclick, 'about__video' ) },
//             m( Asset, { asset: video, muted: false })
//         )
//     }
// }