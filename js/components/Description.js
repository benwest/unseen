var m = require('mithril');

var { BREAKPOINTS } = require('../config');
var bem = require('../utils/bem');
var data = require('../data');
var Asset = require('./Asset');
var ScrollAnimation = require('./ScrollAnimation');

var Static = require('../utils/static');

var autobind = require('../utils/autobind');
var scrollTo = require('../utils/scrollTo');

var Columns = Static({
    view: ({ attrs: { quote, body } }) => m('.row',
        m('.m-col-7.m-off-1.l-col-6', quote ),
        m('.description__body.m-col-7.l-col-8', body )
    )
})

var ElementToggle = {
    view: ({ attrs: { symbol, symbolHover, onclick } }) => {
        return m('.description__element-toggle-track',
            m('.description__element-toggle', { onclick },
                m( Asset, { asset: symbol }),
                m( Asset, { asset: symbolHover }),
            )
        )
    }
}

var DescriptionMain = {
    view: ({ attrs: { quote, attribution, description, elementEntry, toggle } }) => {
        return m('.description__main',
            m( Columns, {
                quote: [
                    m('blockquote', m.trust( quote ) ),
                    m('.attribution', m.trust( attribution ) )
                ],
                body: m.trust( description )
            }),
            elementEntry && m( ElementToggle, {
                symbol: elementEntry.symbolDarkOutlined,
                symbolHover: elementEntry.symbolDarkFilled,
                onclick: toggle
            })
        )
    }
}

// var DescriptionScroll = Static({
//     view: ({ attrs: { quote, attribution, description }}) => {
//         return m('.description-modal__scroll',
//             m('blockquote', m.trust( quote ) ),
//             m('.attribution', m.trust( attribution ) ),
//             m.trust( description )
//         )
//     }
// })

var ElementLayout = {
    view: ({ attrs: {
        elementEntry: { title, summary, sections, symbolLightFilled, symbolLightOutlined },
        toggle
    }}) => {
        return [
            m( Columns, {
                quote: m( 'blockquote', m('p', title.toUpperCase(), m('br'), summary ) ),
                body: sections.map( ({ heading, body }) => {
                    return m('.description__section',
                        m( 'h6', heading ),
                        m.trust( body )
                    )
                })
            }),
            m( ElementToggle, {
                symbol: symbolLightFilled,
                symbolHover: symbolLightOutlined,
                onclick: toggle
            })
        ]
    }
}

var InlineDescription = {
    oninit: autobind,
    open: false,
    toggle: ({ state, dom }) => {
        state.open = !state.open;
        scrollTo( dom );
    },
    view: ({
        attrs: { description, quote, attribution, element },
        state: { open, toggle }
    }) => {
        var elementEntry = data.elements.find( e => e.slug === element );
        return m('.description',
            m( DescriptionMain, { quote, attribution, description, elementEntry, toggle }),
            elementEntry && m('div', { className: bem('description__element', { open }) },
                m( ElementLayout, { elementEntry, toggle })
            )
        )
    }
}

var ModalDescription = {
    oninit: autobind,
    open: false,
    toggle: ({ state }) => state.open = !state.open,
    view: ({ attrs: { description, quote, attribution }, state }) => {
        return [
            m( ScrollAnimation, {
                view: rect => {
                    return m( 'h6', {
                        className: bem('description-modal-open', { hidden: rect.bottom <= window.innerHeight }),
                        onclick: state.toggle
                    }, 'Information' )
                }
            }),// m( 'h6.description-modal-open', { onclick: state.toggle }, 'Information' ),
            m( 'div', { className: bem( 'description-modal', { open: state.open }) },
                m('blockquote', m.trust( quote ) ),
                m('.attribution', m.trust( attribution ) ),
                m('.description-modal__body', m.trust( description ) ),
                m( 'h6.description-modal__close', { onclick: state.toggle }, 'Close' )
            )
        ]
    }
}

module.exports = {
    view: ({ attrs }) => {
        return m( window.innerWidth < BREAKPOINTS.small ? ModalDescription : InlineDescription, attrs );
    }
}