var m = require('mithril');

var Asset = require('./Asset');

module.exports = {
    // onbeforeremove: ({ dom }) => new Promise( resolve => {
    //     dom.addEventListener( 'animationend',  resolve );
    //     dom.classList.add( 'thumbnail--exit' );
    // }),
    view: ({ attrs: { asset, position: [ x, y ] } }) => {
        var transform = `translate(${ x }px, ${ y }px)`;
        return m( Asset, { asset, className: 'thumbnail', style: { transform }} );
    }
}