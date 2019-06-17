var m = require('mithril');
var ScrollAnimation = require('./ScrollAnimation');
var bem = require("../utils/bem");

module.exports = {
    view: ({ children, attrs: { style = 'light', visible = 'top' } } ) => m( ScrollAnimation, {
        className: bem('footer', { [ style ]: true }),
        view: rect => {
            var opacity = Math.abs( rect.bottom - window.innerHeight ) < 100 ? 1 : 0;
            var pointerEvents = opacity > 0 ? '' : 'none';
            return m('h6.footer__text', {
                style: { opacity, pointerEvents }
            }, children )
        }
    })
}