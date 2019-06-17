var m = require('mithril')

var data = require('./data');

var Layout = require('./components/Layout');
var Project = require('./components/Project');
var Conceptroom = require('./components/Conceptroom');
var ConceptroomProject = require('./components/ConceptroomProject');
var About = require('./components/About');
var Contact = require('./components/Contact');

module.exports = {
    
    '/': { render: () => m( Layout, { showProjects: true } ) },
    
    '/project/:slug': {
        onmatch: ({ slug }) => {
            var entry = data.projects.find( entry => entry.slug === slug );
            return Project( entry );
        },
        render: vnode => {
            return m( Layout, { showProjects: true }, vnode )
        }
    },
    
    '/conceptroom/:slug': { render: () => {
        var slug = m.route.param('slug');
        var entry = data.conceptroom.entries.find( entry => entry.slug === slug );
        return m( Layout, m( ConceptroomProject, { entry } ) );
    }},
    
    '/conceptroom': {
        // onmatch: params => console.log( params ),
        render: vnode => m( Layout, m( Conceptroom, vnode.attrs ) )
    },
    
    '/about': { render: () => m( Layout, m( About, { about: data.about, news: data.news } ) ) },
    
    '/contact': { render: () => m( Layout, m( Contact, data.contact ) ) }
    
}