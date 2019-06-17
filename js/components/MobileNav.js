var m = require('mithril')
var bem = require('../utils/bem');

var item = 

module.exports = {
    open: false,
    view: ({ state }) => {
        var item = ( name, href ) => m('h6', {
            onclick: () => {
                state.open = false;
                m.route.set( href );
            },
            className: bem( 'mobile-nav__item', { link: true, active: m.route.get() === href })
         }, name );
        return m('nav', { className: bem('mobile-nav', { open: state.open }) },
            m('div.mobile-nav__background'),
            m( 'h6.mobile-nav__item', { onclick: () => state.open = !state.open },
                m.trust( '&nbsp;' ),
                m( 'span', { className: bem( 'mobile-nav__toggle-text', { visible: !state.open })}, 'Menu' ),
                m( 'span', { className: bem( 'mobile-nav__toggle-text', { visible: state.open })}, 'Close' )
            ),
            item( 'Projects', '/' ),
            item( 'Conceptroom', '/conceptroom' ),
            item( 'About', '/about' ),
            item( 'Contact', '/contact' )
        )
    }
}