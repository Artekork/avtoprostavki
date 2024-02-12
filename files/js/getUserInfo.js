function updateAllInfoProfile() {

    getUserInform().then(userData => {
        if (userData) {

            if (userData.name) {
                document.querySelector('#personal-data__name').placeholder = userData.name;
                document.querySelectorAll('.user-fullname').forEach(function(elem) {
                    elem.textContent  = userData.name;
                });
            }
            if (userData.surname) {
                document.querySelector('#personal-data__surname').placeholder = userData.surname;
                document.querySelectorAll('.user-fullname').forEach(function(elem) {
                    elem.textContent  += " "+userData.surname;
                });
            }
            if (userData.otchestvo) {
                document.querySelector('#personal-data__otch').placeholder = userData.otchestvo;
            }
            if (userData.mobile) {
                document.querySelector('#personal-data__tel').placeholder = userData.mobile;
                document.querySelectorAll('.user-phone').forEach(function(elem) {
                    elem.textContent  = userData.mobile;
                });
            }
            if (userData.email) {
                document.querySelector('#personal-data__mail').placeholder = userData.email;
            }
            if (userData.profileImg) {
                document.querySelectorAll('.user_pic').forEach(function(elem) {
                    elem.src = userData.profileImg;
                });
            }

        } else {
            console.log("Ошибка получения данных пользователя");
        }
    });
}
function updateCartInfoProfile() {

    getUserInform().then(userData => {
        if (userData) {

            if (userData.name) {
                document.querySelector('#personal-data__name_cart').value = userData.name;
            }
            if (userData.surname) {
                document.querySelector('#personal-data__surname_cart').value = userData.surname;
            }
            if (userData.otchestvo) {
                document.querySelector('#personal-data__otch_cart').value = userData.otchestvo;
            }
            if (userData.mobile) {
                document.querySelector('#personal-data__tel_cart').value = userData.mobile;
            }
            if (userData.email) {
                document.querySelector('#personal-data__mail_cart').value = userData.email;
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


async function getMainInfo() {
    try {
        var currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            var database = firebase.database();
            var prostavkiRef = database.ref('accounts/' + currentUser);

            var snapshot = await prostavkiRef.once('value');
            if (snapshot.exists()) {
                var userData = snapshot.val();
                return {
                    adres: userData.adres,
                    mobile: userData.mobile,
                    name: userData.name,
                    otchestvo: userData.otchestvo,
                    surname: userData.surname,
                    email: userData.email
                };
            } else {
                console.log("Данные не найдены");
                return null;
            }
        } else {
            console.log("ID пользователя не найден в локальном хранилище");
            return null;
        }
    } catch (error) {
        console.error("Ошибка при получении данных: ", error);
        return null;
    }
}

export { updateAllInfoProfile, updateCartInfoProfile, getUserInform, getMainInfo };
