var { GUTTER } = require('../config');
var COLUMNS = 16;

var column = () => ( window.innerWidth - ( GUTTER * ( COLUMNS + 1 ) ) ) / COLUMNS;
var columnWidth = ( x = 1 ) => column() * x + GUTTER * ( x - 1 )
var columnOffset = ( x = 1 ) => column() * x + GUTTER * x;

module.exports = { columnWidth, columnOffset };