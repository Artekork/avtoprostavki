
// Импорт нужных функций из Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
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

function insertData(){
    // Вставка данных "Абрикос" со значением 22
    set(ref(db, "Accounts/14567/login"), "login2228");
    set(ref(db, "Accounts/14567/password"), "pass222");
    set(ref(db, "Accounts/14567/name"), "Artem22");
}

function testAlert() {
    alert("Hello world!");  
}


function validationSignUp() {
    const email = document.getElementById('sign-up-input-email').value;
    const password = document.getElementById('sign-up-input-pass').value;
    const conf_password = document.getElementById('sign-up-input-conf-pass').value;

    if (password !== conf_password) {
        alert("Пароли не совпадают");
        return;
    }

    // Проверка наличия email в базе данных
    const userPath = `Accounts/${email.replace()}/`;
    set(ref(db, userPath + "/email"), email);
    set(ref(db, userPath + "/password"), password);

    alert("Пользователь успешно зарегистрирован!");
}

document.querySelector('.dialog-sing-up__btn-sign-up').addEventListener('click', function(){
    validationSignUp();

});
})


