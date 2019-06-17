var m = require('mithril');
var bem = require('../utils/bem');
var fastdom = require('fastdom');
// var srcset = srcs => srcs.map(({ url, w }) => `${ url } ${ w }w`).join(', ');

var once = ( el, event, fn ) => {
    var wrapped = ( ...args ) => {
        fn( ...args );
        el.removeEventListener( event, wrapped );
    }
    el.addEventListener( event, wrapped );
}

var DPR = window.devicePixelRatio;
var last = arr => arr[ arr.length - 1 ];
var bigEnough = ( asset, dest ) => {
    return asset.srcs.find(({ size: [ w, h ] }) => {
        return w >= dest[ 0 ] * DPR && h >= dest[ 1 ] * DPR
    }) || last( asset.srcs )
}

var hasAudio = video => {
    if ( typeof video.audioTracks !== "undefined" ) {
        return video.audioTracks.length > 0;
    } else if ( typeof video.webkitAudioDecodedByteCount !== "undefined" ) {
        return video.webkitAudioDecodedByteCount > 0;
    } else if ( typeof video.mozHasAudio !== "undefined" ) {
        return video.mozHasAudio;
    } else {
        return undefined;
    }
}

var Mute = {
    view: ({ attrs: { muted }}) => {
        var className = bem( 'video__mute', { mute: !muted, unmute: muted });
        return m('div', { className } /*, muted ? 'Unmute' : 'Mute' */ )
    }
}

var Video = {
    oninit: ({ attrs, state }) => {
        state.muted = attrs.muted !== false;
    },
    oncreate: ({ attrs, state, dom }) => {
        var video = dom.querySelector( 'video' );
        if ( attrs.muted !== false ) video.muted = true;
        if ( attrs.autoplay !== false ) video.play();
        video.addEventListener( 'loadeddata', () => {
            state.onclick = e => {
                var video = e.target instanceof HTMLVideoElement
                    ? e.target
                    : e.target.querySelector( 'video' );
                if ( state.muted ) {
                    video.muted = state.muted = false;
                    once( window, 'scroll', () => video.muted = state.muted = true )
                } else {
                    video.muted = state.muted = true;
                }
            }
            state.hasAudio = hasAudio( video );
            fastdom.mutate( m.redraw );
        });
    },
    view: ({
        attrs: {
            asset,
            style = {},
            autoplay = true,
            loop = true,
            playsinline = true,
            showMute = true,
            ...restAttrs
        },
        state: { hasAudio, muted, onclick }
    }) => {
        return m( 'div', { style, ...restAttrs },
            m('div', { className: bem( 'video', { 'has-audio': hasAudio } ), onclick },
                m( 'video', { src: asset.src, autoplay, loop, muted, playsinline }),
                hasAudio && showMute && m( Mute, { muted })
            )
        )
    }
}

var Image = {
    size: null,
    oninit: ({ attrs: { size }, state }) => {
        if ( size ) state.size = size;
    },
    oncreate: ({ attrs, state, dom }) => {
        if ( !state.size ) {
            fastdom.measure(() => {
                state.size = [ dom.offsetWidth, dom.offsetHeight ];
            });
            fastdom.mutate( m.redraw );
        }
    },
    view: ({
        attrs: { asset, style = {}, ...restAttrs },
        state: { size }
    }) => {
        if ( !size ) {
            Object.assign( style, { visibility: 'hidden' } );
            return m('img', { style, ...restAttrs })
        }
        return m('img', { src: bigEnough( asset, size ).url, style, ...restAttrs })
    }
}

module.exports = {
    view: ({ attrs }) => {
        if ( !attrs.asset ) return 'Missing asset';
        switch ( attrs.asset.type ) {
            case 'image':
                return m( Image, attrs );
            case 'video':
                return m( Video, attrs );
            default:
                return `Unknown asset type: ${ attrs.asset.type }`;
        }
    }
}

// module.exports = {
//     size: null,
//     oninit: ({ attrs: { size }, state }) => {
//         if ( size ) state.size = size;
//     },
//     oncreate: ({ attrs, state, dom }) => {
//         if ( !state.size ) {
//             fastdom.measure(() => {
//                 state.size = [ dom.offsetWidth, dom.offsetHeight ];
//             });
//             fastdom.mutate( m.redraw );
//         }
//         if ( attrs.asset.type === 'video' ) {
//             if ( attrs.muted !== false ) dom.setAttribute('muted', 'muted');
//             if ( attrs.autoplay !== false ) dom.play();
//         }
//     },
//     view: ({
//         attrs: {
//             asset,
//             autoplay = true,
//             loop = true,
//             muted = true,
//             playsinline = true,
//             style = {},
//             ...restAttrs
//         },
//         state: { size }
//     }) => {
//         if ( asset === null ) return 'Missing asset';
//         if ( asset.type === 'image' ) {
//             if ( !size ) {
//                 Object.assign( style, { visibility: 'hidden' } );
//                 return m('img', { style, ...restAttrs })
//             }
//             return m('img', { src: bigEnough( asset, size ).url, style, ...restAttrs })
//         } else if ( asset.type ==='video' ) {
//             return m('video', { src: asset.src, autoplay, loop, muted, playsinline, style, ...restAttrs })
//         }
//     }
// }