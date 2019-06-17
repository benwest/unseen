var m = require('mithril')
var bem = require('../utils/bem');

var events = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
}
var prop = Object.keys( events ).find( prop => {
    var el = document.createElement('div');
    return el.style[ prop ] !== undefined;
})
var event = prop ? events[ prop ] : null;

var removeRed = () => document.body.classList.remove('red');

var onbeforeremove = !event ? removeRed : ({ dom }) => new Promise( resolve => {
    removeRed();
    dom.style.top = -window.pageYOffset + 'px';
    dom.addEventListener( 'animationend', resolve );
    dom.classList.add( 'page--exit' );
    window.scrollTo( 0, 0 );
});

module.exports = ( component, modifier ) => ({
    onbeforeremove,
    view: ({ attrs, children }) => {
        return m('div', { className: bem( 'page', modifier ? { [ modifier ]: true } : {} ) },
            m( component, attrs, children )
        )
    }
})

// module.exports = {
//     oninit: () => { console.log('hi') },
//     onbeforeremove: ({ dom, state }) => new Promise( resolve => {
//         dom.style.top = -window.pageYOffset + 'px';
//         dom.addEventListener( 'animationend', resolve );
//         dom.classList.add( 'page--exit' );
//     }),
//     view: ({ children }) => {
//         return m( '.page', children );
//     }
// }