var m = require('mithril');
var fastdom = require('fastdom');

var Asset = require('./Asset');
var ScrollAnimation = require('./ScrollAnimation');

var bem = require('../utils/bem');
var { BREAKPOINTS } = require('../config');
var { clamp, lerp } = require('../utils/math');

var last = arr => arr[ arr.length - 1 ];
var lerpArray = ( arr, t ) => {
    var i = clamp( Math.floor( t ), 0, arr.length - 2 );
    return lerp( arr[ i ], arr[ i + 1 ], t - i );
}

var Item = {
    view: ({ attrs: { title, thumbnail, body, year }}) => {
        return m('.news__item.m-col-6',
            thumbnail && m( Asset, { className: 'news__thumbnail', asset: thumbnail }),
            title && m('h3.news__title', title ),
            body && m.trust( body )
        )
    }
}

var NewsByYear = {
    rowOffsets: null,
    oncreate: ({ dom, state }) => {
        state.updateRows = () => {
            fastdom.measure(() => {
                var rows = [ ...dom.querySelectorAll( '.news__row' ) ];
                state.rowOffsets = rows.map( el => el.offsetTop );
                state.rowOffsets.push( last( state.rowOffsets ) + last( rows ).offsetHeight );
            });
            m.redraw();
        }
        state.updateRows();
        window.addEventListener( 'resize', state.updateRows );
    },
    onremove: ({ state }) => {
        window.removeEventListener( 'resize', state.updateRows );
    },
    view: ({ attrs: { items }, state: { rowOffsets } }) => {
        var rows = [];
        for ( var i = 0; i < items.length; i += 2 ) {
            rows.push( m('.row.news__row',
                m( Item, items[ i ] ),
                m( Item, items[ i + 1 ] )
            ));
        }
        var years = [];
        if ( rowOffsets ) {
            years = items.reduce( ( years, { year }, i ) => {
                var lastYear = years.length === 0 ? null : last( years );
                if ( !lastYear || lastYear.year !== year ) {
                    years.push({ from: i, to: i, year })
                } else {
                    lastYear.to++;
                }
                return years;
            }, [] )
            .map( ({ year, from, to }) => {
                var top = rowOffsets[ Math.floor( from / 2 ) ];
                var bottom = rowOffsets[ Math.ceil( to / 2 ) ]
                return { year, top, height: bottom - top };
            })
            .map( y => m( Year, y ));
        }
        return m('.news', rows, years );
    }
}

var update = ({ dom, state }) => fastdom.measure(() => {
    var h = dom.querySelector('.news__year').offsetHeight;
    if ( h !== state.yearHeight ) {
        state.yearHeight = h;
        m.redraw();
    }
})

var Year = {
    yearHeight: 0,
    oncreate: ({ dom, state }) => {
        state.yearHeight = dom.querySelector('.news__year').offsetHeight;
    },
    view: ({ attrs: { top, height, year }, state: { yearHeight }}) => {
        return m( ScrollAnimation, {
            className: 'news__year-container',
            style: { top: top + 'px', height: height + 'px' },
            initial: () => m( 'h2.news__year.news__year--top', year ),
            view: rect => {
                var center = window.innerHeight / 2;
                var position;
                if ( rect.bottom < center + yearHeight / 2 ) {
                    position = 'bottom';
                } else if ( rect.top > center - yearHeight / 2 ) {
                    position = 'top';
                } else {
                    position = 'fixed';
                }
                return m('h2', {
                    className: 'news__year news__year--' + position
                }, year )
            }
        })
    }
}

module.exports = {
    limit: 100,
    view: ({ attrs: { news }, state }) => {
        var items = news.slice( 0, state.limit );
        return [
            window.innerWidth < BREAKPOINTS.small
                ? m('.news', items.map( item => m( Item, item )))
                : m( NewsByYear, { items } )//groupByYear( items ).map( year => m( Year, year ) )
            ,
            state.limit < news.length && m('.button.news__more', {
                onclick: () => state.limit += 8
            }, 'Show more')
        ]
    }
}