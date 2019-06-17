var m = require('mithril')

var Page = require('./Page');

var bem = require('../utils/bem');
var data = require('../data');
var { BREAKPOINTS } = require('../config');

var Thumbnail = require('./Thumbnail');

var DEFAULT_TEXT_STYLE = { fontSize: 1, lineHeight: 1.2, showDescriptions: true };

var isTouch = 'ontouchstart' in window;

var fitText = ( container, text, minLineHeight = 1.2 ) => {
    var containerHeight = container.getBoundingClientRect().height;
    var min = .1;
    var max = 10;
    var precision = 10;
    text.style.lineHeight = minLineHeight;
    var fontSize, textHeight;
    for ( var i = 0; i < precision; i++ ) {
        fontSize = min + ( max - min ) * .5;
        text.style.fontSize = fontSize + 'em';
        textHeight = text.getBoundingClientRect().height;
        if ( textHeight > containerHeight ) {
            max = fontSize;
            if ( i === precision - 1 ) fontSize = min;
        } else {
            min = fontSize;
        }
    }
    return {
        fontSize: fontSize,
        lineHeight: minLineHeight * Math.max( containerHeight / textHeight, 1 )
    };
}

var updateSize = ({ dom, state }) => {
    var size = [ window.innerWidth, window.innerHeight ];
    if ( size[ 0 ] !== state.size[ 0 ] || size[ 1 ] !== state.size[ 1 ] ) {
        if ( size[ 0 ] >= BREAKPOINTS.small ) {
            dom.classList.add('projects--show-descriptions');
            var text = dom.querySelector('.projects__inner');
            var textStyle = fitText( dom, text );
            var showDescriptions = true;
            // if ( textStyle.fontSize === 1 ) {
            //     dom.classList.remove('projects--show-descriptions');
            //     textStyle = fitText( dom, text );
            //     showDescriptions = false;
            // }
            state.textStyle = { showDescriptions, ...textStyle };
        } else {
            state.textStyle = DEFAULT_TEXT_STYLE;
        }
        state.size = size;
        m.redraw();
    }
}

var unsetThumbnail = state => e => {
    clearTimeout( state.timer );
    state.timer = setTimeout(() => {
        state.thumbnail = null;
        m.redraw();
    }, 50 );
    e.redraw = false;
}

var setThumbnail = ( state, thumbnail ) => e => {
    clearTimeout( state.timer );
    state.thumbnail = thumbnail;
}

module.exports = Page({
    size: [ 0, 0 ],
    textStyle: DEFAULT_TEXT_STYLE,
    thumbnail: null,
    thumbnailPosition: null,
    oncreate: updateSize,
    onupdate: updateSize,
    view: ({ state }) => {
        var route = m.route.get();
        var isHome = route === '/';
        var isProject = route.startsWith('/project');
        var scrollTop = window.pageYOffset;
        var scrollMax = document.documentElement.scrollHeight - window.innerHeight * 2;
        var isProjectEnd = isProject && scrollTop >= scrollMax;
        var disabled = !( isHome || isProjectEnd );
        var hidden = !( isHome || isProject ) || isProject && ( window.innerWidth <= BREAKPOINTS.small || scrollTop > 0 ) && !isProjectEnd;
        var slug = m.route.param('slug');
        var showThumbnail = !disabled && !hidden && state.thumbnailPosition && state.thumbnail;
        return m( 'div',
            {
                className: bem( 'projects', { hovered: state.thumbnail, disabled, hidden, 'show-descriptions': state.textStyle.showDescriptions }),
                onmousemove: isTouch ? undefined : e => state.thumbnailPosition = [ e.offsetX, e.offsetY ],
                // ontouchstart: e => e.preventDefault(),
                // ontouchmove: e => state.thumbnailPosition = [ e.touches[ 0 ].offsetX, e.touches[ 0 ].offsetY ],
                // ontouchend: e => state.thumbnailPosition = null
                // style: { fontSize: state.fontSize }
            },
            m('.projects__inner', { style: { fontSize: state.textStyle.fontSize + 'em', lineHeight: state.textStyle.lineHeight } },
                data.projects.map( project => {
                    var hidden = isProject && !isProjectEnd && slug !== project.slug
                    return m('a',
                        {
                            key: project.slug,
                            className: bem('projects__item', { hidden }),
                            href: '/project/' + project.slug,
                            oncreate: m.route.link,
                            onmouseenter: isTouch ? undefined : setThumbnail( state, project.thumbnail ),
                            // ontouchmove: () => state.thumbnail = project.thumbnail,
                            onmouseleave: isTouch ? undefined : unsetThumbnail( state )
                        },
                        m( '.projects__title', project.title ),
                        m( '.projects__summary', project.summary )
                    )
                }),
                m('span.projects__end', m.trust('&nbsp;') ),
                showThumbnail && m( Thumbnail, { position: state.thumbnailPosition, asset: state.thumbnail })
            )
        )
    }
})