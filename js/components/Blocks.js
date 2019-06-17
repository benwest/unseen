var m = require('mithril');
var { clamp, smoothstep, cmap, lerp, contain } = require('../utils/math');
var bem = require('../utils/bem');
var { columnWidth } = require('../utils/grid');
var { BREAKPOINTS, REM } = require('../config');
var { cmap } = require('../utils/math');
var { quadOut } = require('eases');
var sticky = require('../utils/sticky');

var ScrollAnimation = require('./ScrollAnimation');
var Flipper = require('./Flipper');
var Asset = require('./Asset');
var isTouch = 'ontouchstart' in window;

// var spacing = () => columnWidth() + REM;
var containImage = ( img, cols ) => contain(
    img.size,
    [ columnWidth( cols ), window.innerHeight - REM * 10 ]
)

var TitleBlock = {
    view: ({ attrs: { title, summary, key } }) => m( Block, { i: key, height: window.innerHeight, hero: true },
        m( 'h2.title',
            m('.title__title', title ),
            summary && m('.title__summary', summary )
        )
    )
}

var TextBlock = {
    view: ({ attrs: { text, key } }) => {
        return m( Block, { i: key }, m( 'h2.title', text ) );
    }
}

var ErrorBlock = text => m( TextBlock, { text });

var AssetBlock = {
    flipped: false,
    view: ({ attrs: { asset, caption, key }, state }) => {
        if ( !asset ) return ErrorBlock( 'Error: Asset missing' );
        var size = containImage( asset, 14 );
        var frontImage = m( Asset, { asset, className: 'block__front-image' });
        var className = bem( 'block__image', { caption } )
        return m( Block, { height: size[ 1 ], i: key },
            m( 'div', { className, style: { width: size[ 0 ] + 'px', height: size[ 1 ] + 'px' } },
                !isTouch && caption && asset.type === 'image'
                    ? m( Flipper,
                        m('h6.block__image-caption', caption ),
                        m( Asset, { asset, className: 'block__back-image' }),
                        frontImage
                    )
                    : frontImage
            )
        )
    }
}

var TwoAssetsBlock = {
    view: ({ attrs: { assets, order, key } }) => {
        if ( !assets || assets.length < 2 ) return ErrorBlock( `Error: Asset missing. Block needs 2 assets, has ${ assets.length }` );
        var leftFirst = order === 'leftFirst';
        if ( window.innerWidth < BREAKPOINTS.small ) {
            return [
                m( AssetBlock, { asset: assets[ leftFirst ? 0 : 1 ] }),
                m( AssetBlock, { asset: assets[ leftFirst ? 1 : 0 ] })
            ]
        }
        var [ w0, h0 ] = containImage( assets[ 0 ], 6 );
        var [ w1, h1 ] = containImage( assets[ 1 ], 6 );
        var img0 = {
            className: bem('block__image', { left: leftFirst, right: !leftFirst }),
            asset: assets[ 0 ],
            style: { width: w0 + 'px', height: h0 + 'px' }
        }
        var img1 = {
            className: bem('block__image', { left: !leftFirst, right: leftFirst }),
            asset: assets[ 1 ],
            style: { width: w1 + 'px', height: h1 + 'px' }
        }
        var scrollExtra = ( h1 + window.innerHeight ) / 2;
        return [
            m( Block, { i: key, height: h0, scroll: scrollExtra, marginBottom: `calc( -100vh - ${ scrollExtra }px` }, m( Asset, img0 ) ),
            m( Block, { height: h1 }, m( Asset, img1 ) ),
        ]
    }
}

var Block = {
    view: ({ attrs: { height = window.innerHeight * .5, scroll = 0, marginBottom = '-80vh', i, hero }, children }) => {
        var vh = hero ? window.innerHeight + 'px' : '100vh';
        var scrollHeight = `calc( ${ vh } * 1.5 + ${ height / 2 + scroll }px )`;
        // var scrollHeight = window.innerHeight * 1.5 + ( height / 2 + scroll ) + 'px';
        return m( ScrollAnimation, {
            className: 'block',
            style: { height: scrollHeight, marginBottom },
            view: rect => {
                var t = smoothstep( rect.bottom, window.innerHeight * 2, window.innerHeight );
                var scale = lerp( 1, 1/3, quadOut( clamp( t ) * .6 ) );
                var opacity = lerp( 1, 0, clamp( t ) );
                var numberOpacity = lerp( 1, -1, clamp( t ) );
                var contrast = lerp( 100, 200, clamp( t ) );
                return [
                    i !== undefined && m('.block__number-track', { style: { top: height / 2 + 'px', opacity: numberOpacity } },
                        m('.block__number', i + 1 )
                    ),
                    m('.block__animator', { style: {
                        // top: sticky.isSupported ? ( window.innerHeight - height ) / 2 + 'px' : 0,
                        top: sticky.isSupported ? `calc( ( ${ vh } - ${ height }px ) / 2 )` : 0,
                        height: height + 'px',
                        opacity,
                        transform: `scale(${ scale }, ${ scale })`,
                        filter: `contrast(${ contrast }%)`
                    }}, children )
                ]
            }
        })
    }
}

var getHeight = block => {
    switch ( block.type ) {
        case 'asset': return containImage( block.asset, 14 )[ 1 ];
        case 'twoAssets': return containImage( block.assets[ block.leftFirst ? 0 : 1 ], 6 )[ 1 ];
        case 'text': return window.innerHeight / 2;
    }
}

var Blocks = {
    view: ({ attrs: { blocks }}) => m('.blocks',
        blocks.length > 0 && m('.blocks__total-track', {
                style: { top: getHeight( blocks[ 0 ] ) / 2 + 'px' },
            }, m('.blocks__total', blocks.length )
        ),
        blocks.map( ( block, i ) => {
            var attrs = Object.assign( { key: i }, block );
            switch ( block.type ) {
                case 'text': return m( TextBlock, attrs );
                case 'asset': return m( AssetBlock, attrs );
                case 'twoAssets': return m( TwoAssetsBlock, attrs );
            }
        })
    )
}

module.exports = { Blocks, Block, TextBlock, AssetBlock, TwoAssetsBlock, TitleBlock };