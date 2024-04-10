document.addEventListener("DOMContentLoaded", function () {
    var dialog = document.querySelector('.dialog-receipt');
    var openButton = document.querySelector('.sample-documents__link');
    var closeButton = document.querySelector('.dialog-receipt__close-btn');
    var body = document.body;

    openButton.addEventListener('mousedown', function () {
        dialog.showModal();
        body.classList.add('dialog-opened');
    });

    closeButton.addEventListener('click', function () {
        dialog.close();
        body.classList.remove('dialog-opened');
    });    

    dialog.addEventListener('click', function (event) {
        // Проверяем, был ли клик вне диалогового окна
        if (event.target === dialog) {
            dialog.close();
            body.classList.remove('dialog-opened');
        }
    });
});