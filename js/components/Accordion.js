var m = require('mithril');
var $ = require('jquery');

module.exports = {
    oncreate: ({ dom }) => {
        var $content = $( '.accordion__content', dom );
        $content.slideUp( 0 );
        dom.querySelector('.accordion__title').addEventListener('click', () => {
            $content.slideToggle( 200 );
        })
    },
    view: ({ attrs: { title, content }, state }) => {
        return m('.accordion',
            m('.accordion__title', title ),
            m('div', {
                className: 'accordion__content' + ( state.open ? ' accordion__content--open' : '' )
            }, content ),
        )
    }
}