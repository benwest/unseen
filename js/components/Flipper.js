var m = require('mithril');
var tween = require('../utils/tween');
var { map, lerp } = require('../utils/math')

var TILT = 5;

var id = 0;

var Transition = ( value = 0 ) => ({
    value,
    target: value,
    tick () {
        this.value = lerp( this.value, this.target, .1 )
    }
})

module.exports = {
    // flipped: false,
    // tilt: [ 0, 0 ],
    // oninit: ({ state }) => {
    //     state.id = 'flipper' + ++id;
    // },
    oncreate: ({ dom, state }) => {
        var inner = dom.querySelector('.flipper__inner');
        var tilt = [ Transition(), Transition() ];
        var flip = Transition();
        var render = () => inner.style.transform = `
            rotateY(${ tilt[ 0 ].value + flip.value }deg)
            rotateX(${ tilt[ 1 ].value }deg)
        `;
        var tick = () => {
            tilt[ 0 ].tick();
            tilt[ 1 ].tick();
            flip.tick();
            render();
            state.frame = requestAnimationFrame( tick );
        }
        dom.addEventListener( 'mousemove', e => {
            // if ( e.target !== dom ) return;
            tilt[ 0 ].target = map( e.offsetX, 0, dom.clientWidth, -TILT, TILT );
            tilt[ 1 ].target = map( e.offsetY, 0, dom.clientHeight, TILT, -TILT );
        })
        dom.addEventListener('mouseleave', e => {
            tilt[ 0 ].target = 0;
            tilt[ 1 ].target = 0;
        })
        dom.addEventListener( 'click', e => {
            flip.target += 180;
        })
        tick();
    },
    onremove: ({ state }) => window.cancelAnimationFrame( state.frame ),
    view: ({ attrs, children }) => {
        return m('.flipper', m('.flipper__inner', children ));
    }
}