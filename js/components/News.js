var m = require('mithril');
var Asset = require('./Asset');
var { BREAKPOINTS } = require('../config');

var last = arr => arr[ arr.length - 1 ];

var Item = {
    view: ({ attrs: { title, thumbnail, body, year }}) => {
        return m('.news__item',
            thumbnail && m( Asset, { className: 'news__thumbnail', asset: thumbnail }),
            title && m('h3.news__title', title ),
            body && m.trust( body )
        )
    }
}

var Year = {
    view: ({ attrs: { year, items }}) => {
        return m('.row.news__row',
            m('.news__year-container', m( 'h2.news__year', year ) ),
            items.map( item => m( Item, item ))
        )
    }
}

var groupByYear = items => {
    var years = [];
    for ( var i = 0; i < items.length; i += 2 ) {
        var y = items[ i ].year;
        if ( !years.length || last( years ).year !== y ) {
            years.push({
                year: y,
                items: []
            });
        }
        last( years ).items.push( items[ i ], items[ i + 1 ] );
    }
    return years;
}

module.exports = {
    limit: 6,
    view: ({ attrs: { news }, state }) => {
        var items = news.slice( 0, state.limit );
        return [
            window.innerWidth < BREAKPOINTS.small
                ? m('.news.row.news__row', items.map( item => m( Item, item )))
                : groupByYear( items ).map( year => m( Year, year ) )
            ,
            state.limit < news.length && m('h6.news__more', {
                onclick: () => state.limit += 8
            }, 'Show more')
        ]
    }
}