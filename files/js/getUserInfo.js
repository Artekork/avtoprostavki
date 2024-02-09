function updateAllInfoProfile() {
    getUserInform().then(userData => {
        if (userData) {

            if (userData.name) {
                document.querySelectorAll('#personal-data__name').placeholder = userData.name;
            }
            if (userData.surname) {
                document.querySelectorAll('#personal-data__surname').placeholder = userData.surname;
            }
            if (userData.otchestvo) {
                document.querySelectorAll('#personal-data__otch').placeholder = userData.otchestvo;
            }
            if (userData.mobile) {
                document.querySelectorAll('#personal-data__tel').placeholder = userData.mobile;
            }
            if (userData.email) {
                document.querySelectorAll('#personal-data__mail').placeholder = userData.email;
            }
            if (userData.img) {
                document.querySelectorAll('.user-info-img__img').src = userData.img;
            }

        } else {
            console.log("Ошибка получения данных пользователя");
        }
    });
}


function getUserInform() {
    var currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        

        var database = firebase.database();
        var prostavkiRef = database.ref('accounts/' + currentUser);

        return prostavkiRef.once('value').then(function(snapshot) {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("Данные не найдены");
                return null;
            }
        }).catch(function(error) {
            console.error("Ошибка получения данных: " + error);
            return null;
        });
    } else {
        console.log("ID пользователя не найден в локальном хранилище");
        return null;
    }      
}

export { updateAllInfoProfile };
