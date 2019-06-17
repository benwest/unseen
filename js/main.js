var m = require("mithril")
var FontFaceObserver = require('fontfaceobserver');
var routes = require('./routes');

if ( require('./utils/sticky').isSupported ) {
    document.documentElement.classList.toggle( 'touch', 'ontouchstart' in window );
    document.documentElement.classList.toggle( 'hi-dpi', window.devicePixelRatio > 1 );
    new FontFaceObserver('Ogg').load().then(() => {
        m.route.prefix('');
        m.route( document.body, '/', routes );
        window.addEventListener( 'resize', m.redraw );
        // redraws in first oncreates are ignored so do one now
        m.redraw();
    });
} else {
    m.render( document.body, m('h2.title.title--fixed',
        'Your browser is too old to display this website correctly. You should ',
        m('a', {
            href: 'https://updatemybrowser.org/',
            target: '_blank',
            style: { textDecoration: 'underline' }
        }, 'update it.')
    ))
}