import { createToast } from "./notif.js";


document.addEventListener("DOMContentLoaded", function () {
    var dialog = document.querySelector('.dialog_call');
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

    if (document.querySelector('.banner-btn__call-btn')){
        document.querySelector('.banner-btn__call-btn').addEventListener('mousedown', function () {
            dialog.showModal();
            body.classList.add('dialog-opened');
        });
    }
    


    document.querySelector("#call").addEventListener('click', function(){
        sendEmailFeedback('Позвонить');
    });
    document.querySelector("#write").addEventListener('click', function(){
        sendEmailFeedback("Написать")
    });


    function sendEmailFeedback(method){
        // alert('Письмо успешно отправлено')
        // let userMail = "vseparoli2228@gmail.com"; // Адрес электронной почты для отправки
        // let userPass = "testPassword123"; // Пароль для отправки
    
        // Отправляем POST-запрос на сервер

        let name = document.querySelector("#name").value;
        let email = document.querySelector("#mail").value;
        let phone = document.querySelector("#number").value;
        let comment = document.querySelector("#comment").value;
        if (name !== "") {
                
        } else {
            alert('Введите ваше имя')
            return
        }
        if (validateEmail(email)) {
        
        } else{
            alert('Введите корреткный адрес почты')
            return
        }
        if (phone !== "") {
        
        } else{
            alert('Введите номер телефона')
            return
        }
        if (document.querySelector("#check").checked) {
        
        } else{
            alert('Вы должны согласитьс))я)')
            return
        }
        

        if (name !== "" && validateEmail(email) && phone !== "") {
            fetch('https://belavtoprostavki.by/send-feedback-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: name, 
                email: email, 
                phone: phone, 
                comment: comment,
                method: method }) // Передаем адрес электронной почты и пароль в теле запроса
            })
            .then(response => {
                if (response.ok) {
                    // Если запрос выполнен успешно, вы можете обновить интерфейс или вывести сообщение об успехе
                    createToast("success", "Мы получили вашу заявку");
                    dialog.close();
                    body.classList.remove('dialog-opened');
                } else {
                    createToast("error", "Произошла ошибка при отправке");

                }
            })
            .catch(error => {
                createToast("error", "Произошла ошибка при отправке");
            });
        } 
        


        
    }

    function validateEmail(email) {
        var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return re.test(String(email).toLowerCase());
    }
    // Скрываем окно
    closeButton.addEventListener('click', function () {
        dialog.close();
        body.classList.remove('dialog-opened');
    });    

    // Кнопки "Звонок" и "Написать"
    var callButton = document.getElementById('call');
    var writeButton = document.getElementById('write');
    // var methodField = document.getElementById('methodField');

    // callButton.addEventListener('mousedown', function () {
    //     methodField.value = 'call';
    // });

    // writeButton.addEventListener('mousedown', function () {
    //     methodField.value = 'write';
    // });

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

    // // Добавленная проверки в момент отправки формы
    // document.querySelector('form').addEventListener('submit', function(event) {
    //     var phoneNumberInput = document.getElementById('number');
    //     var phoneNumberValue = phoneNumberInput.value;
        
    //     // Извлекаем только цифры из номера телефона
    //     var digitsOnly = phoneNumberValue.replace(/\D/g, '');

    //     // Проверяем
    //     if (digitsOnly.length < 12) {
    //         phoneNumberInput.setCustomValidity('Введите корректный телефон');
    //         event.preventDefault(); // Предотвращаем отправку формы
    //     } else {
    //         phoneNumberInput.setCustomValidity('');
    //     }
    // });

    dialog.addEventListener('mousedown', function (event) {
        // Проверяем, был ли клик вне диалогового окна
        if (event.target === dialog) {
            dialog.close();
            body.classList.remove('dialog-opened');
        }
    });
});