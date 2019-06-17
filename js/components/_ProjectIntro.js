var m = require('mithril');
var ScrollAnimation = require('./ScrollAnimation');
var { Block } = require('./Blocks');

var { REM, BREAKPOINTS } = require('../config');

module.exports = {
    // cursor: [ -100, -100 ],
    view: ({ attrs: { title } }) => {
        var showText = window.innerWidth < BREAKPOINTS.small;
        // var [ cx, cy ] = state.cursor;
        return m( ScrollAnimation, {
            className: 'project-intro',
            // style: { position: showText ? 'absolute' : '' },
            // onmousemove: e => state.cursor = [ e.clientX, e.clientY ],
            // onmouseleave: e => state.cursor = [ -100, -100 ],
            view: rect => {
                return [
                    m( 'h6.project-intro__title', {
                        style: { opacity: rect.top < 0 ? 1 : 0 },
                    }, title ),
                    m( 'h6.project-intro__scroll', {
                        style: { opacity: rect.top < 0 ? 0 : 1 },
                    }, 'Scroll' ),
                ]
                // return m( '.project-intro__cursor', {
                //     style: {
                //         transform: `translate(${ cx }px, ${ cy }px)`,
                //         opacity: 1 - ( -rect.top / rect.height )
                //     }
                // }, 'Scroll' );
            }
        })
    }
}