var m = require('mithril');
var ScrollAnimation = require('./ScrollAnimation');

module.exports = {
    view: ({ children }) => m( ScrollAnimation, {
        className: 'header',
        view: rect => m('h6.header__text', {
            style: { opacity: rect.top < window.innerHeight && rect.bottom > 0 ? 1 : 0 }
        }, children )
    })
}