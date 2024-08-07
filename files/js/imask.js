document.addEventListener("DOMContentLoaded", function () {

    // Маска для ввода телефона
    let element = document.getElementById('number');
    let maskOptions = {
        mask: '+375 (00) 000-00-00',
        lazy: false,
        overwrite: true,
        oncomplete: function () {
            element.setCustomValidity('');
        },
        onincomplete: function () {
            element.setCustomValidity('Введите корректный телефон');
        },
        oncleared: function () {
            element.setCustomValidity('');
        }
    };
    let mask = new IMask(element, maskOptions);
})