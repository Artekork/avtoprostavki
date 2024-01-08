
// Импорт нужных функций из Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
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
const app = initializeApp(firebaseConfig);
const db = getDatabase();

function testAlert() {
    alert("Hello world!");  
}

async function isUserExists(email) {
    var userPath = `Accounts/${email.replace('.', ',').replace(/\s/g, '').toLowerCase()}/`;
    var userSnapshot = await get(ref(db, userPath));
    return userSnapshot.exists();
}
async function getUserData(email) {
    var userPath = `Accounts/${email.replace('.', ',').replace(/\s/g, '').toLowerCase()}/`;
    var userSnapshot = await get(ref(db, userPath));

    if (userSnapshot.exists()) {
        return userSnapshot.val(); // Возвращает объект данных пользователя
    } else {
        return null; // Пользователь не найден
    }
}
function validationSignUp() {
    var email = document.getElementById('sign-up-input-email').value;
    var password = document.getElementById('sign-up-input-pass').value;
    var conf_password = document.getElementById('sign-up-input-conf-pass').value;


    if (email === ''){
        document.querySelector('.sing-up-email__error').innerText = 'Введите E-mail';
        return;
    } else{
        document.querySelector('.sing-up-email__error').innerText = '';
    }
    if (password === ''){
        document.querySelector('.sing-up-pass__error').innerText = 'Введите пароль';
        return;
    }else{
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
    }else{
        document.querySelector('.sing-up-conf-pass__error').innerText = '';
    }

    isUserExists(email)
    .then((exists) => {
        if (exists) {
            document.querySelector('.sing-up-email__error').innerText = 'Пользователь с таким email уже существует';
        } else {
            const userPath = `Accounts/${email.replace('.', ',').replace(/\s/g, '').toLowerCase()}/`;

            set(ref(db, userPath + "/email"), email);
            set(ref(db, userPath + "/password"), password);
            alert("Пользователь успешно зарегистрирован!");
        }
    })
    .catch((error) => {
        console.error("Произошла ошибка при проверке пользователя:", error);
    });
}


function validationSignIn() {
    var email = document.getElementById('sign-in-input-email').value;
    var password = document.getElementById('sign-in-input-pass').value;
    const userPath = `Accounts/${email.replace('.', ',').replace(/\s/g, '').toLowerCase()}/`;

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
                    alert("Успех");
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
})


