var m = require('mithril');
var bem = require('../utils/bem');

module.exports = {
    view: ({ attrs: { on } }) => m('div', { className: bem( 'screensaver', { on }) })
}