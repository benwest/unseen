var m = require('mithril');

var Page = require('./Page');
var { Blocks, TitleBlock } = require('./Blocks');
var Description = require('./Description');
var ScrollAnimation = require('./ScrollAnimation')
var Header = require('./Header');
var Footer = require('./Footer')
var Conceptroom = require('./Conceptroom');
var { cmap } = require('../utils/math')
var { BREAKPOINTS } = require('../config');

var touch = 'ontouchstart' in window;

module.exports = Page({
    view: ({ attrs: { entry } }) => {
        return [
            m('.project__intro',
                window.innerWidth > BREAKPOINTS.small && m( Footer, 'Scroll' ),
                m( TitleBlock, entry )
            ),
            m('.project__body',
                m( Header, entry.title ),
                m( Blocks, entry ),
                m( Description, entry ),
                m( Footer, { style: window.innerWidth < BREAKPOINTS.small ? 'light' : 'dark' }, m('a', {
                    onclick: () => m.route.set( '/conceptroom', {}, { state: { from: entry.slug } })
                }, 'Back to Conceptroom' ))
            )
            // m( Conceptroom )
            // m( ScrollAnimation, {
            //     onclick: () => m.route.set( '/conceptroom', {}, { state: { from: entry.slug } } ),
            //     oncreate: m.route.link,
            //     className: 'back',
            //     view: rect => {
            //         var blur = cmap( rect.top, window.innerHeight, window.innerHeight * .8, 30, 0 );
            //         console.log( rect.top );
            //         return m('h2.title', {
            //             style: { filter: `blur( ${ blur }px )` }
            //         }, 'Back to Conceptroom')
            //     }
            // })
        ]
    }
})