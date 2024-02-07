import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set, get, update} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

import { updateAllInfoProfile } from "./getUserInfo.js";

document.querySelector('.section-user-info__apply-changes').addEventListener('click', function(){
    
    let name = document.querySelector('#personal-data__name').value.trim();
    let surname = document.querySelector('#personal-data__surname').value.trim();
    let otch = document.querySelector('#personal-data__otch').value.trim();
    let tel = document.querySelector('#personal-data__tel').value.trim();
    let email = document.querySelector('#personal-data__mail').value.trim();

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

    if (Object.keys(userData).length === 0) {
        alert("Нет данных для обновления.");
        return; // Не выполнять обновление, если нет данных для обновления
    }

    var currentUser = localStorage.getItem('currentUser')
    var path = '/accounts/'+currentUser;

    get(ref(getDatabase(), path)).then((snapshot) => {
        const existingData = snapshot.val();

        for (const key in userData) {
            existingData[key] = userData[key];
        }

        return update(ref(getDatabase(), path), existingData);
    }).then(()=> {
        alert("Успех")

        document.querySelector('#personal-data__name').value = "";
        document.querySelector('#personal-data__surname').value = "";
        document.querySelector('#personal-data__otch').value = "";
        document.querySelector('#personal-data__tel').value = "";
        document.querySelector('#personal-data__mail').value = "";

        updateAllInfoProfile();


    }).catch(error => {
        console.error("Ошибка при записи в базу данных:", error);
    });
});