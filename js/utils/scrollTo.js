require('smoothscroll-polyfill').polyfill();

module.exports = el => window.scrollTo({
    top: window.pageYOffset + el.getBoundingClientRect().top - parseFloat( window.getComputedStyle( el ).marginTop ),
    behavior: 'smooth'
})