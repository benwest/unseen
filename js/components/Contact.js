var m = require('mithril');
var bem = require("../utils/bem");

var Page = require('./Page');
var Newsletter = require('./Newsletter')

module.exports = Page({
    oncreate: ({ state }) => {
        setTimeout( () => {
            if ( m.route.get() === '/contact' ) document.body.classList.add('red')
        }, 1000 );
    },
    // onremove: () => document.body.classList.remove('red'),
    view: ({ attrs: { heading, body, newsletterCTA, regNumber, privacyPolicy } }) => {
        return m('.row.contact',
            m('.contact__heading.s-col-16.m-col-14.m-off-1',
                m('h2', heading )
            ),
            m('.contact__body.s-col-16.m-col-14.m-off-1',
                m.trust( body ),
                m( Newsletter, { newsletterCTA })
            ),
            m('.contact__footer.s-col-16.m-col-14.m-off-1',
                m('.contact__copyright', `© THEUNSEEN ${ new Date().getFullYear() }` ),
                m('.contact__seperator', m.trust('&nbsp;|&nbsp;')),
                m('.contact__reg',  `Registered No. ${ regNumber }`),
                privacyPolicy && [
                    m('.contact__seperator', m.trust('&nbsp;|&nbsp;')),
                    m( 'a', { href: privacyPolicy, target: '_blank' }, 'Privacy Policy' )
                ],
                m('.contact__credit',
                    'Site by ',
                    m('a', { href: 'http://www.2xelliott.co.uk/', target: 'blank'},
                        'Two Times Elliott'
                    )
                )
            )
        )
    }
})