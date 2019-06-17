var m = require('mithril');
var { clamp, smoothstep, cmap, lerp, contain } = require('../utils/math');
var vh = require('../utils/vh');
var bem = require('../utils/bem');
var { columnWidth } = require('../utils/grid');
var { BREAKPOINTS, REM } = require('../config');

var ScrollAnimation = require('./ScrollAnimation');
var Asset = require('./Asset');

var spacing = () => columnWidth() + REM;
var containImage = ( img, cols ) => contain(
    img.size,
    [ columnWidth( cols ), vh() - spacing() * 2 ]
)

var Animator = {
    view: ({ attrs: { fixed, height, t, top }, children } ) => {
        var scale = lerp( 1, 0, t );
        var opacity = lerp( 1, 0, t );
        var contrast = lerp( 100, 200, t );
        var style = {
            opacity,
            transform: `translate( -50%, -50% ) scale(${ scale }, ${ scale })`,
            filter: `contrast(${ contrast }%)`,
            position: fixed ? 'fixed' : 'absolute',
            height: height + 'px',
            top: ( fixed ? vh( .5 ) : top || height / 2 ) + 'px',
        }
        return m('.block__animator', { style }, children );
    }
}

var Block = {
    view: ({ attrs: { height, marginBottom = 0 }, children }) => {
        return m( ScrollAnimation, {
            className: 'block',
            style: { height: height + 'px', marginBottom: marginBottom + 'px' },
            view: rect => {
                var start = ( vh() - height ) / 2;
                var fixed = rect.top < start;
                var t = clamp( smoothstep( rect.top, start, start - vh() ) );
                return m( Animator, { height, fixed, t }, children );
            }
        })
    }
}

var TextBlock = {
    view: ({ attrs: { text, i } }) => {
        return m( Block, { height: vh( i === 0 ? 1 : 2/3 ) }, m( 'h2.title', text ) );
    }
}

var AssetBlock = {
    flipped: false,
    view: ({ attrs: { asset, caption }, state }) => {
        var size = containImage( asset, 14 );
        var style = { width: size[ 0 ] + 'px', height: size[ 1 ] + 'px' };
        var onclick = caption ? () => state.flipped = !state.flipped : () => {};
        var height = size[ 1 ];
        var marginBottom = ( vh() - size[ 1 ] ) / 2;
        var className = bem( 'block__image', { flipped: state.flipped, caption })
        return m( Block, { height, marginBottom },
            m('div', { className, style, onclick },
                caption && m( Asset, { asset, className: 'block__back-image' }),
                m( Asset, { asset, className: 'block__front-image' }),
                caption && m('h6.block__image-caption', caption )
            )
        )
    }
}

var TwoAssetsBlock = {
    view: ({ attrs: { assets, order } }) => {
        var leftFirst = order === 'leftFirst';
        if ( window.innerWidth < BREAKPOINTS.small ) {
            return [
                m( AssetBlock, { asset: assets[ leftFirst ? 0 : 1 ] }),
                m( AssetBlock, { asset: assets[ leftFirst ? 1 : 0 ] })
            ]
        }
        var [ w0, h0 ] = containImage( assets[ 0 ], 6 );
        var [ w1, h1 ] = containImage( assets[ 1 ], 6 );
        return m( ScrollAnimation, {
            className: 'block',
            style: { height: h0 + h1 + 'px', marginBottom: ( vh() - h1 ) / 2 + 'px' },
            view: rect => {
                var center0 = rect.top + h0 / 2;
                var center1 = rect.top + h0 + h1 / 2;
                var t = cmap( center1, vh( .5 ), vh( -.5 ), 0, 1 );
                var anim0 = {
                    fixed: center0 < vh( .5 ),
                    t,
                    height: h0
                };
                var anim1 = {
                    fixed: center1 < vh( .5 ),
                    t,
                    height: h1,
                    top: h0 + h1 / 2
                }
                var img0 = {
                    className: bem('block__image', { left: leftFirst, right: !leftFirst }),
                    asset: assets[ 0 ],
                    style: { width: w0 + 'px', height: h0 + 'px' }
                };
                var img1 = {
                    className: bem('block__image', { left: !leftFirst, right: leftFirst }),
                    asset: assets[ 1 ],
                    style: { width: w1 + 'px', height: h1 + 'px' }
                }
                return [
                    m( Animator, anim0, m( Asset, img0 )),
                    m( Animator, anim1, m( Asset, img1 )),
                ]
            }
        })
    }
}

var Blocks = {
    view: ({ attrs: { blocks }}) => blocks.map( ( block, i ) => {
        var attrs = Object.assign( { i }, block );
        switch ( block.type ) {
            case 'text': return m( TextBlock, attrs );
            case 'asset': return m( AssetBlock, attrs );
            case 'twoAssets': return m( TwoAssetsBlock, attrs );
        }
    })
}

module.exports = { Blocks, Block, TextBlock, AssetBlock, TwoAssetsBlock };