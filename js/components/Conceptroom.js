var m = require('mithril');
var data = require('../data');

var ScrollAnimation = require('./ScrollAnimation');
var Footer = require('./Footer');
var Asset = require('./Asset');

var Page = require('./Page');
var keyframes = require('../utils/keyframes');
var bem = require('../utils/bem');
var { map, contain } = require('../utils/math');
var { BREAKPOINTS, GUTTER } = require('../config');
var { columnWidth, columnOffset } = require('../utils/grid');

var opacity = keyframes([
    [ -.5, 0 ],
    [ -.25, 1 ],
    [ .25, 1 ],
    [ .5, 0 ]
]);

var transformer = ([ fromX, fromY ], [ toX, toY ]) => t => {
    var x = map( t, 1, -1, fromX, toX );
    var y = map( t, 1, -1, fromY, toY );
    return `translate( ${ x }vw, ${ y }vh )`;
}

var left = transformer([ 100, 0 ], [ -100, 0 ]);
var right = transformer([ -100, 0 ], [ 100, 0 ]);
var up = transformer([ 0, 100 ], [ 0, -100 ]);
var down = transformer([ 0, -100 ], [ 0, 100 ]);

var composition = ({
    left, width, top = 1, bottom = 1, align = [ 0, 0 ], animation
}) => ( assetSize, t ) => {
    var x = columnOffset( left );
    var w = columnWidth( width );
    var y = top < 1 ? window.innerHeight * top : top * GUTTER;
    var b = bottom < 1 ? window.innerHeight * bottom : bottom * GUTTER;
    var maxSize = [ w, window.innerHeight - y - b ];
    var size = contain( assetSize, maxSize );
    return {
        width: size[ 0 ] + 'px',
        height: size[ 1 ] + 'px',
        left: x + ( maxSize[ 0 ] - size[ 0 ] ) * align[ 0 ] + 'px',
        top: y + ( maxSize[ 1 ] - size[ 1 ] ) * align[ 1 ] + 'px',
        transform: animation( t )
    }
}

var compositions = [
    [{ // 1
        left: 10,
        width: 4,
        animation: up
    },{
        left: 1,
        width: 8,
        align: [ 1, .5 ],
        animation: down
    },{
        left: 5,
        width: 5,
        top: 2,
        bottom: 2,
        align: [ 1, 1 ],
        animation: up
    }],
    [{ // 2
        left: 7,
        width: 4,
        top: 2,
        bottom: 2,
        animation: down
    },{
        left: 1,
        width: 6,
        align: [ 0, 1 ],
        animation: right
    },{
        left: 8,
        width: 7,
        align: [ 0, .5 ],
        animation: left
    }],
    [{ // 3
        left: 2,
        width: 5,
        top: 2,
        bottom: 2,
        align: [ 1, 0 ],
        animation: down
    },{
        left: 9,
        width: 4,
        top: 4,
        bottom: 4,
        animation: left
    },{
        left: 7,
        width: 7,
        top: .5,
        bottom: 3,
        align: [ 0, 1 ],
        animation: up
    },{
        left: 3,
        width: 3,
        align: [ 1, 1 ],
        animation: right
    }],
    [{ // 4
        left: 4,
        width: 4,
        top: 2,
        bottom: 2,
        align: [ 1, 0 ],
        animation: right
    },{
        left: 7,
        width: 3,
        top: 4,
        bottom: 4,
        animation: up
    },{
        left: 10,
        width: 5,
        top: .5,
        bottom: 2,
        animation: down
    },{
        left: 3,
        width: 6,
        top: .5,
        align: [ 1, 1 ],
        animation: up
    }]
].map( defs => defs.map( composition ))

var Text = ( t, children ) => {
    var o = opacity( t );
    return m('.title.title--fixed', {
        style: { opacity: o, pointerEvents: o > .5 ? 'visible' : 'none' }
    }, children );
}
var Title = ( t, title, slug ) => Text( t, m('a',
    slug && { href: `/conceptroom/${ slug }`, oncreate: m.route.link },
    m('h2.title__title', title ),
    m( 'h6', 'View' )
))

// Oh boy
// var scrollPosition = 0;

module.exports = Page({
    hovered: -1,
    oncreate: ({ attrs: { from }, state }) => {
        state.onscroll = () => {
            state.hovered = -1;
            var sh = document.documentElement.scrollHeight;
            var wh = window.innerHeight;
            if ( window.pageYOffset >= sh - wh * 1.5 ) {
                window.scrollTo( 0, sh - wh * ( data.conceptroom.entries.length + 1 ) * 1.5 );
            }
        }
        if ( from ) {
            const idx = data.conceptroom.entries.findIndex( entry => entry.slug === from )
            const scrollPosition = window.innerHeight * ( 1 + idx * 1.5 )
            window.scrollTo( 0, scrollPosition )
        }
        window.addEventListener( 'scroll', state.onscroll, { passive: true });
        // ;
    },
    onremove: ({ state }) => {
        // scrollPosition = window.pageYOffset;
        window.removeEventListener( 'scroll', state.onscroll );
    },
    view: ({ state }) => {
        var title = () => m( ScrollAnimation, {
            className: 'composition',
            style: { height: window.innerHeight + 'px' },
            view: rect => {
                var t = rect.top / window.innerHeight;
                return Text( t, m( 'h2', data.conceptroom.introText ) )
            }
        })
        var entries = data.conceptroom.entries.concat([ data.conceptroom.entries[ 0 ] ]);
        return [
            m( Footer, 'Scroll' ),
            title(),
            ...entries.map( ({ title, slug, summary, composition, thumbnails }, i ) => {
                return m( ScrollAnimation, {
                    className: 'composition',
                    style: { marginBottom: i === entries.length ? 0 : '50vh' },
                    view: rect => {
                        var t = rect.top / window.innerHeight;
                        var small = window.innerWidth < BREAKPOINTS.small;
                        if ( small ) {
                            return [
                                m( Asset, {
                                    className: 'composition__single-asset',
                                    showMute: false,
                                    asset: thumbnails[ 0 ]
                                }),
                                Title( t, title, slug )
                            ]
                        } else {
                            if ( t < -1 || t > 2 ) return;
                            return [
                                thumbnails.map( ( thumbnail, i ) => {
                                    var dark = state.hovered !== -1 && state.hovered !== thumbnail.id;
                                    return m('a', {
                                        className: bem( 'composition__asset', { dark }),
                                        href: `/conceptroom/${ slug }`,
                                        oncreate: m.route.link,
                                        onmouseenter: () => state.hovered = thumbnail.id,
                                        onmouseleave: () => state.hovered = -1,
                                        style: compositions[ composition ][ i ]( thumbnail.size, t )
                                    }, m( Asset, { asset: thumbnail, showMute: false }) )
                                }),
                                Title( t, title, slug )
                            ]
                        }
                    }
                })
            })
        ]
    }
})