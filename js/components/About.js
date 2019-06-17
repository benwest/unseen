var m = require('mithril');
var fastdom = require('fastdom');

var Page = require('./Page');
var Asset = require('./Asset');
var Accordion = require('./Accordion');
var News = require('./News');
var Lightbox = require('./Lightbox');

var bem = require('../utils/bem');
var scrollTo = require('../utils/scrollTo');

var nav = active => m('.nav',
    [ 'Profile', 'Clients', 'Ethos', 'News'].map( ( text, i ) => {
        return m( 'h6',{
            className: bem( 'nav__item', { active: i === active } ),
            onclick: () => scrollTo( document.querySelectorAll( '.about__section' )[ i ] )
        }, text )
    })
)

var Profile = {
    showVideo: false,
    view: ({ attrs: { video, body, people }, state }) => m('.row', m('.m-col-14.m-off-1',
        state.showVideo && m( Lightbox, { asset: video, close: () => state.showVideo = false }),
        m('h2.m-bottom',
            'We are ',
            m('span.about__name', 'Theunseen' ),
            '. View our story ',
            m( 'a.outline', { onclick: () => state.showVideo = true }, 'here.' ),
        ),
        m.trust( body ),
        people.map(({ name, bio }, i ) => {
            return m( Accordion, {
                title: m('h2', i === 0 ? 'Read About ' : 'Or ', m( 'a.outline', name ) ),
                content: m('.about__bio', m.trust( bio ) )
            })
        })
    ))
}

var renderClients = clients => m('.row',
    m('.m-col-14.m-off-1',
        m('.about__clients',
            clients.map( asset => {
                return m('.about__client', m( Asset, { asset }))
            })
        )
    )
)

var renderEthos = ( quote, attribution, description ) => m('.row',
    m('.m-col-7.m-off-1',
        m('blockquote', m.trust( quote ) ),
        m('.attribution', m.trust( attribution ) )
    ),
    m('.about__ethos.s-col-16.m-col-7', m.trust( description ) )
)

module.exports = Page({
    section: 0,
    oncreate: ({ dom, state }) => {
        state.onscroll = () => {
            fastdom.measure(() => {
                var sections = [ ...dom.querySelectorAll('.about__section') ]
                state.section = sections.findIndex( section => {
                    return section.getBoundingClientRect().bottom > 0
                })
            })
            m.redraw();
        }
        window.addEventListener( 'scroll', state.onscroll );
        state.onscroll();
    },
    onremove: ({ state }) => {
        window.removeEventListener( 'scroll', state.onscroll );
    },
    view: ({
        attrs: {
            about: { video, body, people, quote, attribution, description, clients },
            news
        },
        state
    }) => {
        return m('.about',
            nav( state.section ),
            m('.about__section.about__section--profile',
                m( Profile, { video, body, people } )
            ),
            m('.about__section',
                m( 'h6.about__section-title', 'Clients' ),
                renderClients( clients )
            ),
            m('.about__section',
                m( 'h6.about__section-title', 'Ethos' ),
                renderEthos( quote, attribution, description )
            ),
            m('.about__section',
                m( 'h6.about__section-title', 'News' ),
                m( News, { news } )
            ),
        )
    }
})