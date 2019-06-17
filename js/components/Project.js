var m = require('mithril')

var Projects = require('./Projects');
var Page = require('./Page');
// var ProjectIntro = require('./ProjectIntro');
var { Blocks, TitleBlock } = require('./Blocks');
var Header = require('./Header');
var Footer = require('./Footer');
var Description = require('./Description');
var { BREAKPOINTS } = require('../config');

var touch = 'ontouchstart' in window;

module.exports = entry => Page({
    view: () => {
        return m('.project',
            m('.project__intro',
                window.innerWidth < BREAKPOINTS.small && m( TitleBlock, entry ),
                m( Footer, 'Scroll' )
            ),
            m('.project__body',
                m( Header, entry.title ),
                m( Blocks, entry ),
                m( Description, entry )
            )
        )
    }
}, 'project' );