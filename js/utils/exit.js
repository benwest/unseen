var events = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
}
var prop = Object.keys( events ).find( prop => {
    var el = document.createElement('div');
    return el.style[ prop ] !== undefined;
})
var event = prop ? events[ prop ] : null;

module.exports = cls => !event ? () => {} : ({ dom }) => Promise.all([
    new Promise( resolve => setTimeout( resolve, 5000 ) ),
    new Promise( resolve => {
        dom.addEventListener( event, resolve );
        dom.classList.add( cls );
    })
])