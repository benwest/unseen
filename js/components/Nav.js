var m = require('mithril')
var bem = require('../utils/bem');

var item = ( name, href ) => m('h6', {
    href,
    oncreate: m.route.link,
    className: bem( 'nav__item', { active: m.route.get() === href } )
 }, name );

module.exports = {
    view: () => {
        return m('nav.nav.nav--vertical',
            item( 'Projects', '/' ),
            item( 'Conceptroom', '/conceptroom' ),
            item( 'About', '/about' ),
            item( 'Contact', '/contact' )
        )
    }
}