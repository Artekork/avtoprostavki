// Импорт нужных функций из Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
import { createToast } from "../notif.js";
window.addEventListener('DOMContentLoaded', function() {

// Конфигурация Firebase для вашего веб-приложения
const firebaseConfig = {
    apiKey: "AIzaSyBksjnCLyWqL4004kCtrpjzt6mZzl3mk5E",
    authDomain: "avtoprostavki-1337.firebaseapp.com",
    databaseURL: "https://avtoprostavki-1337-default-rtdb.firebaseio.com",
    projectId: "avtoprostavki-1337",
    storageBucket: "avtoprostavki-1337.appspot.com",
    messagingSenderId: "580863358064",
    appId: "1:580863358064:web:133ed9c449a5338601b0b5",
    measurementId: "G-SL7W9G5G4E"
};

// Инициализация Firebase
var firebase = initializeApp(firebaseConfig);
const db = getDatabase();

function testAlert() {
    alert("Hello world!");  
}

async function isUserExists(email) {
    var userPath = `accounts/${email.replace('.', ',').replace(/\s/g, '')}/`;
    var userSnapshot = await get(ref(db, userPath));
    return userSnapshot.exists();
}

function validateEmail(email) {
    var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(String(email).toLowerCase());
}

function validationSignUp() {
    var email = document.getElementById('sign-up-input-email').value;
    var password = document.getElementById('sign-up-input-pass').value;
    var conf_password = document.getElementById('sign-up-input-conf-pass').value;


    if (!validateEmail(email)){
        document.querySelector('.sing-up-email__error').innerText = 'Введите корректный E-mail';
        return;
    } else{
        document.querySelector('.sing-up-email__error').innerText = '';
    }
    if (password === ''){
        document.querySelector('.sing-up-pass__error').innerText = 'Введите пароль';
        return;
    } else{
        document.querySelector('.sing-up-pass__error').innerText = '';
    }
    if (password < 8){
        document.querySelector('.sing-up-pass__error').innerText = 'Пароль меньше 8-ми символов';
        return;
    } else{
        document.querySelector('.sing-up-pass__error').innerText = '';
    }
     if (password !== conf_password) {
        document.querySelector('.sing-up-conf-pass__error').innerText = 'Пароли не совпадают';
        return;
    } else{
        document.querySelector('.sing-up-conf-pass__error').innerText = '';
    }

    isUserExists(email.replace('.', ',').replace(/\s/g, '')).then((exists) => {
        if (exists) {
            document.querySelector('.sing-up-email__error').innerText = 'Пользователь с таким email уже существует';
        } else {
            // const userPath = `accounts/${email.replace('.', ',').replace(/\s/g, '')}/`;

            // set(ref(db, userPath + "/email"), email);
            // set(ref(db, userPath + "/password"), password);
            // alert("Пользователь успешно зарегистрирован!");
            
            // // document.querySelector('.header_nav').classList.add('header_nav_authorized');
            // // document.querySelector('.li_nav_sign').style.display = 'none';

            // saveCurrentUser(email);

            // document.body.classList.remove('dialog-sign-opened');
            // clearSignData()
            // location.reload();
            sendEmailVerification(email, password)

            createToast("success", "Подтверждение отправлено вам на почту");
            setTimeout(() => {
                closeSignInUp()
            }, 1500);
        }
    })
    .catch((error) => {
        console.error("Произошла ошибка при проверке пользователя:", error);   
        createToast("error", "Произошла ошибка при проверке пользователя");

    });
}


function validationSignIn() {
    var email = document.getElementById('sign-in-input-email').value;
    var password = document.getElementById('sign-in-input-pass').value;
    const userPath = `accounts/${email.replace('.', ',').replace(/\s/g, '')}/`;

    if (email === ''){
        document.querySelector('.sing-in-email__error').innerText = 'Введите E-mail';
        return;
    } else{
        document.querySelector('.sing-in-email__error').innerText = '';
    }
    if (password === ''){
        document.querySelector('.sing-in-pass__error').innerText = 'Введите пароль';
        return;
    }else{
        document.querySelector('.sing-in-pass__error').innerText = '';
    }

    get(ref(db, userPath))
        .then((userSnapshot) => {
            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                const storedPassword = userData.password;

                if (password === storedPassword) {
                    // alert("Успех");

                    // addCarRecord()

                    // document.querySelector('.header_nav').classList.add('header_nav_authorized');
                    // document.querySelector('.li_nav_sign').style.display = 'none';

                    saveCurrentUser(email);
                    createToast("success", "Вы вошли в аккаунт!");

                    setTimeout(() => {
                        document.body.classList.remove('dialog-sign-opened');
                        clearSignData();
                        location.reload();
                    }, 2000);
                } else {
                    document.querySelector('.sing-in-pass__error').innerText = 'Неверный логин или пароль';
                    return;
                }
            } else {
                document.querySelector('.sing-in-pass__error').innerText = 'Неверный логин или пароль';
        return;
            }
        })
        .catch((error) => {
            console.error("Произошла ошибка при проверке пользователя:", error);
        });

}
//sign in
document.querySelector('.dialog-sing-in__btn-sign-in').addEventListener('click', function(){
    validationSignIn();
});
//sign up
document.querySelector('.dialog-sing-up__btn-sign-up').addEventListener('click', function(){
    validationSignUp();
});

// Sign-in-eye
document.querySelector('.sign-in__check-pass').addEventListener('click', function(){
    this.classList.toggle('sign-in__check-pass_active');
    
    var passwordInput = document.querySelector('#sign-in-input-pass');

    // Проверка текущего типа и изменение на противоположный
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
});
// Sign-up-eye
document.querySelector('.sign-up__check-pass').addEventListener('click', function(){
    this.classList.toggle('sign-up__check-pass_active');
    
    var passwordInput = document.querySelector('#sign-up-input-conf-pass');

    // Проверка текущего типа и изменение на противоположный
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
});




function clearSignData(){
    document.getElementById('sign-in-input-email').value = "";
    document.getElementById('sign-in-input-pass').value= "";

    document.getElementById('sign-up-input-email').value= "";
    document.getElementById('sign-up-input-pass').value= "";
    document.getElementById('sign-up-input-conf-pass').value= "";

    document.querySelector('.sing-in-email__error').innerText = '';
    document.querySelector('.sing-in-pass__error').innerText = '';
    document.querySelector('.sing-up-email__error').innerText = '';
    document.querySelector('.sing-up-pass__error').innerText = '';
    document.querySelector('.sing-up-conf-pass__error').innerText = '';
    
}
document.querySelectorAll('.sing-in-create__tittle').forEach(function(element){
    element.addEventListener('click', function(){
        document.querySelector('.dialog-auth').classList.toggle('dialog-auth_sign-in')
        document.querySelector('.dialog-auth').classList.toggle('dialog-auth_sign-up')

        clearSignData()
    })
})

document.querySelector('.sign-in-button').addEventListener('click', function(){
    document.body.classList.add('dialog-sign-opened');    
})

document.querySelectorAll('.close-sign').forEach(function(element){
    element.addEventListener('click', function(){
        closeSignInUp();
    })
})

function closeSignInUp(){
    document.body.classList.remove('dialog-sign-opened');

    document.querySelector('.dialog-auth').classList.add('dialog-auth_sign-in')
    document.querySelector('.dialog-auth').classList.add('dialog-auth_sign-up')

    
    clearSignData()
}

function saveCurrentUser(userLogin) {
    localStorage.setItem('currentUser', userLogin.replace('.',','));
}

// this.document.querySelector('.product_tittle').addEventListener('click', function(){
//     alert(localStorage.getItem('currentUser'))
// })

// var isAutorised = localStorage.getItem('currentUser');
// if (isAutorised) {
//     document.querySelector('.header_nav').classList.add('header_nav_authorized');
//     document.querySelector('.li_nav_sign').style.display = 'none';
// } 

this.document.querySelectorAll('.user-card__exit').forEach(element => {
    element.addEventListener('click', function(){
        localStorage.removeItem('currentUser');
        location.reload();
    })
});




function addSimpleProduct() {
    // Получите ссылку на базу данных
  
    // Путь к вашим данным в базе данных Firebase
    const path = '/prostavki/prostavka4337/';
  


    // Данные для добавления
    const carData = {
      article: "56-123-22",
      characteristics: {
        condition: "новый",
        material: "капролон",
        models: {
            audi: "rs7, rs8",
            bmw: "m5, m6"
        },
        thickness: "15мм",
        type: "оригинал"
      },
      images: {
        1: "https://firebasestorage.googleapis.com/v0/b/avtoprostavki-1337.appspot.com/o/avtoprostavki%2Fprostavka228%2F2.png?alt=media&token=a01c97c7-3dd9-4d79-b1cd-fd95b4725704",
        2: "https://firebasestorage.googleapis.com/v0/b/avtoprostavki-1337.appspot.com/o/avtoprostavki%2Fprostavka228%2F2.png?alt=media&token=a01c97c7-3dd9-4d79-b1cd-fd95b4725704",
      },
      description: "Проставки из резины для передней оси автомобилей Audi A8 (D2)",
      id: 2,
      placement: "Передние",
      price: "2,28"
    };
  


    // Добавление данных в Firebase
    set(ref(db, path), carData)
      .then(() => {
        console.log('Запись успешно добавлена в Firebase!');
      })
      .catch((error) => {
        console.error('Ошибка при добавлении записи в Firebase:', error);
      });
}


function addCarProduct() {
    // Получите ссылку на базу данных
  
    // Путь к вашим данным в базе данных Firebase
    const path = '/cars/audi/models/rs7(2022)/prostavka1';
  
    // Данные для добавления
    const carData = {
      article: "",
      characteristics: {
        condition: "новый",
        material: "капролон",
        model: "rs7",
        thickness: "15мм",
        type: "оригинал"
      },
      description: "Проставки из капролона для задней оси автомобилей Audi A8 (D2) ...", // Ваше описание
      id: 1,
      placement: "задние",
      price: "23,49"
    };
  


    // Добавление данных в Firebase
    set(ref(db, path), carData)
      .then(() => {
        console.log('Запись успешно добавлена в Firebase!');
      })
      .catch((error) => {
        console.error('Ошибка при добавлении записи в Firebase:', error);
      });
}

function addCar() {
    var car_name = "volkswagen"

    var car_text = "Volkswagen"
    var car_url = "https://firebasestorage.googleapis.com/v0/b/avtoprostavki-1337.appspot.com/o/cars_logo%2Fvolkswagen.png?alt=media&token=5d629739-0fb7-48ae-a52b-4b854d76b80f"
        
    const path = '/cars/'+car_name;
  
    // Данные для добавления
    const carData = {      
        img: car_url,
        text: car_text
    };
    
  
    // Добавление данных в Firebase
    set(ref(db, path), carData)
      .then(() => {
        console.log('Запись успешно добавлена в Firebase!');
      })
      .catch((error) => {
        console.error('Ошибка при добавлении записи в Firebase:', error);
    });
}
    
// document.querySelector('h1').addEventListener('click', function(){
//     addSimpleProduct();
// })

function sendEmailVerification(userMail, userPass){
    // alert('Письмо успешно отправлено')
    // let userMail = "vseparoli2228@gmail.com"; // Адрес электронной почты для отправки
    // let userPass = "testPassword123"; // Пароль для отправки

    // Отправляем POST-запрос на сервер
    fetch('https://belavtoprostavki.by/send-verification-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userMail, password: userPass }) // Передаем адрес электронной почты и пароль в теле запроса
    })
    .then(response => {
        if (response.ok) {
            // Если запрос выполнен успешно, вы можете обновить интерфейс или вывести сообщение об успехе
            console.log('Письмо с подтверждением отправлено');
        } else {
            console.error('Ошибка при отправке письма с подтверждением');
        }
    })
    .catch(error => {
        console.error('Ошибка при отправке запроса:', error);
    });
}

})


