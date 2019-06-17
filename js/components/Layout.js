var m = require('mithril')

var Intro = require('./Intro');
var Nav = require('./Nav');
var MobileNav = require('./MobileNav');
var Projects = require('./Projects');
var Screensaver = require('./Screensaver');

module.exports = {
    idle: false,
    oncreate: ({ state }) => {
        var timer;
        var reset = () => {
            clearTimeout( timer );
            timer = setTimeout( () => {
                state.idle = true;
                m.redraw();
            }, 40000 );
            if ( state.idle ) {
                state.idle = false;
                m.redraw();
            }
        }
        reset();
        window.addEventListener( 'mousemove', reset );
        window.addEventListener( 'scroll', reset );
        window.addEventListener( 'touchstart', reset );
    },
    view: ({ attrs: { showProjects }, state, children }) => {
        return m('main',
            m( Screensaver, { on: state.idle } ),
            m( Intro ),
            m( Nav ),
            m( MobileNav ),
            m( 'a.logo', { href: '/', oncreate: m.route.link }),
            showProjects && m( Projects ),
            children
        )
    }
}