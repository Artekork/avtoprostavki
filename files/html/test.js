window.addEventListener('DOMContentLoaded', function() {
    this.document.querySelector('.burger-button').addEventListener('click', function(){
        document.querySelector('.burger-panel').classList.toggle('burger-panel_is-active')
    })

    this.document.querySelector('.burger-panel__close-btn').addEventListener('click', function(){
        document.querySelector('.burger-panel').classList.toggle('burger-panel_is-active')
        consol.log('asd');
    })
    function testAlert() {
        alert("Hello world!");  
    }
})