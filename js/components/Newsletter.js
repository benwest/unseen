/* global fetch */

var m = require('mithril')
var bem = require('../utils/bem');

// var CSRF = document.querySelector('input[name="CRAFT_CSRF_TOKEN"]').value;

var sendForm = form => fetch( form.getAttribute('action'), {
    method: form.getAttribute('method'),
    body: new FormData( form ),
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
})

module.exports = {
    oninit: ({ state }) => {
        state.onsubmit = state.onsubmit.bind( state, state );
        state.oninput = state.oninput.bind( state, state );
    },
    onsubmit: ( state, e ) => {
        e.preventDefault();
        state.message = 'Subscribing...'
        sendForm( e.target )
            .then( r => r.json() )
            .then( r => {
                state.message = r.message;
            })
            .catch( e => {
                console.log( e );
                state.message = 'An error occurred. Try again?'
            })
            .finally(() => {
                m.redraw();
                setTimeout(() => {
                    state.message = null;
                    m.redraw();
                }, 5000 )
            })
    },
    oninput: ( state, e ) => state.valid = e.target.checkValidity(),
    valid: false,
    message: null,
    view: ({ attrs: { newsletterCTA }, state: { valid, oninput, onsubmit, message } }) => {
        return m('p',
            m('form.newsletter',
                {
                    onsubmit,
                    action: '/',
                    method: 'POST'
                },
                m('input[type="email"].newsletter__input', {
                    name: 'email',
                    oninput,
                    placeholder: newsletterCTA,
                    required: true
                }),
                m('input[type="hidden"]', { name: 'action', value: "mailchimpSubscribe/list/subscribe" }),
                // m('input[type="hidden"]', { name: 'CRAFT_CSRF_TOKEN', value: CSRF }),
                m('input[type="submit"]', { className: bem( 'newsletter__submit', { valid }), value: 'Send' }),
                message && m('.newsletter__message', message )
            )
        )
    }
}