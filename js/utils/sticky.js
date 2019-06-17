var isSupported = ['', '-webkit-', '-moz-', '-ms-'].some( prefix => {
    const testNode = document.createElement('div');
    try {
        testNode.style.position = prefix + 'sticky';
    }
    catch(e) {}
    return testNode.style.position != '';
})

module.exports = {
    isSupported
}