document.addEventListener("DOMContentLoaded", function () {
    var dialog = document.querySelector('dialog');
    var openButtons = document.querySelectorAll('.open_dialog_btn');

        // Обработчик события для всех кнопок
        openButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                dialog.showModal();
            });
        });

        // Скрываем окно
        document.getElementById('close').onclick = function () {
            dialog.close();
        };

    // Затемнение
    var closeButton = document.getElementById('close');
    var body = document.body;

    openButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            dialog.showModal();
            body.classList.add('dialog-opened');
        });
    });

    closeButton.addEventListener('click', function () {
        dialog.close();
        body.classList.remove('dialog-opened');
    });
});   
// Затемнение
document.addEventListener("DOMContentLoaded", function () {
    var openButton = document.getElementById("open");
    var dialog = document.querySelector("dialog");
    var closeButton = document.getElementById("close");
    var body = document.body;

    openButton.addEventListener("click", function () {
        dialog.showModal();
        body.classList.add("dialog-opened");
    });

    closeButton.addEventListener("click", function () {
        dialog.close();
        body.classList.remove("dialog-opened");
    });
});        
// Маска для ввода телефона

var element = document.getElementById('number');
var maskOptions = {
    mask: '+375 (00) 000-00-00',
    lazy: false,
    overwrite: true,  // Позволяет перезаписывать символы ввода
    oncomplete: function () {
        element.setCustomValidity('');  // Сбрасываем сообщение об ошибке при полном вводе
    },
    onincomplete: function () {
        element.setCustomValidity('Придурок, телефон введи');
    },
    oncleared: function () {
        element.setCustomValidity('');
    }
};
var mask = new IMask(element, maskOptions);

// Добавленная проверка в момент отправки формы
document.querySelector('form').addEventListener('submit', function(event) {
    var phoneNumberInput = document.getElementById('number');
    var phoneNumberValue = phoneNumberInput.value;

    // Извлекаем только цифры из номера телефона
    var digitsOnly = phoneNumberValue.replace(/\D/g, '');

    // Проверяем
    if (digitsOnly.length < 12  ) {
        phoneNumberInput.setCustomValidity('Придурок, телефон введи');
        event.preventDefault(); // Предотвращаем отправку формы
    } else {
        phoneNumberInput.setCustomValidity('');
    }
});





document.addEventListener("DOMContentLoaded", function () {
var dialog = document.querySelector('dialog');
var callButton = document.getElementById('call');
var writeButton = document.getElementById('write');
var methodField = document.getElementById('methodField');

// Выводим диалоговое окно
document.getElementById('open').onclick = function () {
    dialog.showModal();
}

// Скрываем окно
document.getElementById('close').onclick = function () {
    dialog.close();
}

// Обработчик события для кнопки "Звонок"
callButton.addEventListener('click', function () {
    methodField.value = 'call';
});

// Обработчик события для кнопки "Написать"
writeButton.addEventListener('click', function () {
    methodField.value = 'write';
});

// Затемнение
var openButton = document.getElementById('open');
var closeButton = document.getElementById('close');
var body = document.body;

openButton.addEventListener('click', function () {
    dialog.showModal();
    body.classList.add('dialog-opened');
});

closeButton.addEventListener('click', function () {
    dialog.close();
    body.classList.remove('dialog-opened');
});
});