var m = require('mithril');
var fastdom = require('fastdom');

module.exports = {
    rect: null,
    oncreate: ({ dom, state }) => {
        state.onscroll = () => {
            fastdom.measure(() => state.rect = dom.getBoundingClientRect());
            fastdom.mutate( m.redraw );
        }
        window.addEventListener( 'scroll', state.onscroll, { passive: true } );
        state.onscroll();
    },
    onremove: ({ state }) => {
        window.removeEventListener( 'scroll', state.onscroll )
    },
    view: ({ attrs: { element = 'div', view, initial, ...restAttrs }, state: { rect } }) => {
        var children = '';
        if ( rect ) {
            children = view( rect );
        } else if ( initial ) {
            children = initial();
        }
        return m( element, restAttrs, children )
    }
}