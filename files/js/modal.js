document.addEventListener("DOMContentLoaded", function () {
    var dialog = document.querySelector('dialog');
    var openButtons = document.querySelectorAll('.open_dialog_btn');
    var closeButton = document.getElementById('close');
    var body = document.body;

    // Обработчик события для всех кнопок
    openButtons.forEach(function (button) {
        button.addEventListener('mousedown', function () {
            dialog.showModal();
            body.classList.add('dialog-opened');
        });
    });

    // Скрываем окно
    closeButton.addEventListener('click', function () {
        dialog.close();
        body.classList.remove('dialog-opened');
    });

    

    // Кнопки "Звонок" и "Написать"
    var callButton = document.getElementById('call');
    var writeButton = document.getElementById('write');
    var methodField = document.getElementById('methodField');

    callButton.addEventListener('mousedown', function () {
        methodField.value = 'call';
    });

    writeButton.addEventListener('mousedown', function () {
        methodField.value = 'write';
    });

    // Маска для ввода телефона
    var element = document.getElementById('number');
    var maskOptions = {
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
    var mask = new IMask(element, maskOptions);

    // Добавленная проверки в момент отправки формы
    document.querySelector('form').addEventListener('submit', function(event) {
        var phoneNumberInput = document.getElementById('number');
        var phoneNumberValue = phoneNumberInput.value;
        
        // Извлекаем только цифры из номера телефона
        var digitsOnly = phoneNumberValue.replace(/\D/g, '');

        // Проверяем
        if (digitsOnly.length < 12) {
            phoneNumberInput.setCustomValidity('Введите корректный телефон');
            event.preventDefault(); // Предотвращаем отправку формы
        } else {
            phoneNumberInput.setCustomValidity('');
        }
    });

    dialog.addEventListener('click', function (event) {
        // Проверяем, был ли клик вне диалогового окна
        if (event.target === dialog) {
            dialog.close();
            body.classList.remove('dialog-opened');
        }
    });
});