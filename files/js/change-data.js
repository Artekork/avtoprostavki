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

    if (tel !== "") {
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
    
        // Подготавливаем информацию о заказе
        let orderData = {
            date: new Date().toLocaleDateString('ru-RU'), // Дата заказа в формате дд.мм.гггг
            userId: currentUser,
            payMethod: "cash", // Предполагаемый способ оплаты, можно изменить по вашему усмотрению
            list: selectedProducts, // Выбранные товары и их количество
            userData: userData // Данные пользователя
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
    }).catch(error => {
        console.error("Ошибка при получении информации о пользователе: ", error);
    });
}

export { updateUserData, addOrder };
