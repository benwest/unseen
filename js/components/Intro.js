var m = require('mithril');

var data = require('../data');

module.exports = {
    done: false,
    oninit: ({ state }) => {
        if ( m.route.get() !== '/' ) state.done = true;
    },
    oncreate: ({ dom, state }) => {
        if ( state.done ) return;
        setTimeout( () => dom.style.pointerEvents = 'none', 3500 );
        dom.addEventListener('animationend', () => {
            state.done = true;
            m.redraw();
        })
    },
    view: ({ state }) => {
        return state.done 
            ? ''
            : m('.intro',
                m('h2.intro__text', data.introText )
            )
    }
}