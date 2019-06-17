var m = require('mithril');

module.exports = Component => ({
    onbeforeupdate: () => false,
    view: ({ attrs, children }) => m( Component, attrs, children )
})