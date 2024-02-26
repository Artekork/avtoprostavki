import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set, get, update} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

import { updateAllInfoProfile, getMainInfo} from "./getUserInfo.js";

document.querySelector('.section-user-info__apply-changes').addEventListener('click', function(){    
    updateUserData();
});



function getUserDataFromInput(){
    let name = document.querySelector('#personal-data__name').value.trim();
    let surname = document.querySelector('#personal-data__surname').value.trim();
    let otch = document.querySelector('#personal-data__otch').value.trim();
    let tel = document.querySelector('#personal-data__tel').value.trim();
    let email = document.querySelector('#personal-data__mail').value.trim();
    let adres = document.querySelector('#personal-data__adres').value.trim();





    let userData = {};

    if (name !== "") {
        userData.name = name;
    }

    if (surname !== "") {
        userData.surname = surname;
    }

    if (otch !== "") {
        userData.otchestvo = otch;
    }

    if (tel.replace(/\D/g, '').length == 12) {
        userData.mobile = tel;
    } 
    
    if (email !== "") {
        userData.email = email;
    }

    if (adres !== "") {
        userData.adres = adres;
    }

    if (Object.keys(userData).length === 0) {
        alert("Нет данных для обновления.");
        return; // Не выполнять обновление, если нет данных для обновления
    }
    return userData
}





document.getElementById('personal-data__tel').addEventListener('focus', function(){
    // Маска для ввода телефона
    var element = document.getElementById('personal-data__tel');
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
}) 

function updateUserData(){


    let userData = getUserDataFromInput();

    let currentUser = localStorage.getItem('currentUser')
    let pathToAcc = '/accounts/'+currentUser;

    get(ref(getDatabase(), pathToAcc)).then((snapshot) => {
        let existingData = snapshot.val();

        for (const key in userData) {
            existingData[key] = userData[key];
        }

        return update(ref(getDatabase(), pathToAcc), existingData);
    }).then(()=> {

        document.querySelector('#personal-data__name').value = "";
        document.querySelector('#personal-data__surname').value = "";
        document.querySelector('#personal-data__otch').value = "";
        document.querySelector('#personal-data__tel').value = "";
        document.querySelector('#personal-data__mail').value = "";

        updateAllInfoProfile();

    }).catch(error => {
        console.error("Ошибка при записи в базу данных:", error);
    });
}

function addOrder(){
    const uniqueId = () => {
        const dateString = Date.now().toString(36);
        const randomness = Math.random().toString(36).substr(2);
        return dateString + randomness;
    };
    let currentUser = localStorage.getItem('currentUser');

    // Получаем информацию о пользователе
    getMainInfo().then(userData => {
        // Собираем выбранные товары и их количество
        let selectedProducts = {};
        document.querySelectorAll('.cart-checkbox:checked').forEach(function(checkbox) {
            let productId = checkbox.id;
            let quantity = parseInt(checkbox.closest('.section-cart__product').querySelector('.section-cart_product-counter').textContent);
            selectedProducts[productId] = quantity;
        });

        let price = document.querySelector('.section-cart__confirm-total-cost').textContent
    
        // Подготавливаем информацию о заказе
        let orderData = {
            date: new Date().toLocaleDateString('ru-RU'), // Дата заказа в формате дд.мм.гггг
            userId: currentUser,
            payMethod: "cash", // Предполагаемый способ оплаты, можно изменить по вашему усмотрению
            list: selectedProducts, // Выбранные товары и их количество
            price: price,
            userData: userData // Данные пользователя
        };
        
        // Путь к новому заказу
        let pathToOrder = '/orders/' + uniqueId();
    
        // Добавляем информацию о заказе в базу данных
        firebase.database().ref(pathToOrder).set(orderData)
            .then(function() {
                console.log("Заказ успешно добавлен в базу данных.");
                
                // Добавляем информацию о заказе в историю пользователя
                let historyRef = firebase.database().ref('accounts/' + currentUser + '/history');

                // Добавляем каждый купленный товар по его идентификатору в историю пользователя
                for (const productId in selectedProducts) {
                    if (selectedProducts.hasOwnProperty(productId)) {
                        historyRef.child(productId).set(selectedProducts[productId])
                            .then(function() {
                                console.log("Информация о товаре добавлена в историю пользователя.");
                            })
                            .catch(function(error) {
                                console.error("Ошибка при добавлении информации о товаре в историю пользователя:", error);
                            });
                    }
                }



            })
            .catch(function(error) {
                console.error("Ошибка при добавлении заказа в базу данных:", error);
            });
        }).catch(error => {
            console.error("Ошибка при получении информации о пользователе: ", error);
        });
}

function addOrderUnlogin() {
    const uniqueId = () => {
        const dateString = Date.now().toString(36);
        const randomness = Math.random().toString(36).substr(2);
        return dateString + randomness;
    };

    // Получаем информацию о пользователе из куки
    var userData = Cookies.getJSON('userInfo');

    // Собираем выбранные товары и их количество из куки
    let selectedProducts = {};
        document.querySelectorAll('.cart-checkbox:checked').forEach(function(checkbox) {
            let productId = checkbox.id;
            let quantity = parseInt(checkbox.closest('.section-cart__product').querySelector('.section-cart_product-counter').textContent);
            selectedProducts[productId] = quantity;
        });
        
    // Подготавливаем информацию о заказе
    let price = document.querySelector('.section-cart__confirm-total-cost').textContent

    let orderData = {
        date: new Date().toLocaleDateString('ru-RU'), // Дата заказа в формате дд.мм.гггг
        payMethod: "cash", // Предполагаемый способ оплаты, можно изменить по вашему усмотрению
        list: selectedProducts, // Выбранные товары и их количество
        price: price,
        userData: userData // Данные пользователя из куки
    };
    
    // Путь к новому заказу
    let pathToOrder = '/orders/' + uniqueId();

    // Добавляем информацию о заказе в базу данных
    firebase.database().ref(pathToOrder).set(orderData)
        .then(function() {
            console.log("Заказ успешно добавлен в базу данных.");
        })
        .catch(function(error) {
            console.error("Ошибка при добавлении заказа в базу данных:", error);
        });
}


export { updateUserData, addOrder, addOrderUnlogin};
