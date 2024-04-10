import { createToast } from "./notif.js";


function updateAllInfoProfile() {

    if (getUserInform() != null){
        getUserInform().then(userData => {
            if (userData) {
    
                if (userData.name) {
                    if (document.querySelector('#personal-data__name')){
                        document.querySelector('#personal-data__name').placeholder = userData.name;
                    }
                    document.querySelectorAll('.user-fullname').forEach(function(elem) {
                        elem.textContent  = userData.name;
                    });
                }
                if (userData.surname) {
                    if(document.querySelector('#personal-data__surname')){
                        document.querySelector('#personal-data__surname').placeholder = userData.surname;
                        
                    }
                    document.querySelectorAll('.user-fullname').forEach(function(elem) {
                        elem.textContent  += " "+userData.surname;
                    });
                }
                if (userData.otchestvo) {
                    if(document.querySelector('#personal-data__otch')){
                        document.querySelector('#personal-data__otch').placeholder = userData.otchestvo;
                        
                    }
                }
                if (userData.mobile) {
                    if(document.querySelector('#personal-data__tel')){
                        document.querySelector('#personal-data__tel').placeholder = userData.mobile;
                    }
                    document.querySelectorAll('.user-phone').forEach(function(elem) {
                        elem.textContent  = userData.mobile;
                    });
                }
                if (userData.email) {
                    if(document.querySelector('#personal-data__mail')){
                        document.querySelector('#personal-data__mail').placeholder = userData.email; 
                    }
                }
                if (userData.profileImg) {
                    document.querySelectorAll('.user_pic').forEach(function(elem) {
                        elem.src = userData.profileImg;
                    });
                }
    
            } else {
                console.log("Ошибка получения данных пользователя");
                createToast("error", "Ошибка получения данных пользователя!");

            }
        });
    } else {
        console.log("getUserInform = null")
    }
}
function updateCartInfoProfile() {

    if(getUserInform() != null){
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
    } else {
        
    }
}

function getUserInform() {
    var currentUser = localStorage.getItem('currentUser');
    if (currentUser) {       

        var database = firebase.database();
        let prostavkiRef = database.ref('accounts/' + currentUser);

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




function getHistory() {
    return new Promise((resolve, reject) => {
        var currentUser = localStorage.getItem('currentUser');
        var historyRef = database.ref('accounts/' + currentUser + '/history');

        // Создаем объект, в котором будем хранить первые изображения для каждого товара
        var firstImages = {};

        // Получаем список купленных товаров пользователя
        historyRef.once('value')
            .then(function(snapshot) {
                var promises = []; // Массив для хранения промисов получения первых изображений
                snapshot.forEach(function(childSnapshot) {
                    var productId = childSnapshot.key; // Получаем ID продукта из истории

                    // Получаем ссылку на изображения товара
                    var imagesRef = database.ref('prostavki/' + productId + '/images');

                    // Добавляем промис получения первого изображения в массив
                    var promise = imagesRef.once('value')
                        .then(function(imagesSnapshot) {
                            var firstImage = null;

                            // Ищем первое изображение
                            imagesSnapshot.forEach(function(imageChildSnapshot) {
                                if (!firstImage) {
                                    firstImage = imageChildSnapshot.val();
                                }
                            });

                            // Если первое изображение найдено, добавляем его в список
                            if (firstImage) {
                                firstImages[productId] = firstImage;
                            }
                        })
                        .catch(function(error) {
                            console.error("Error fetching first image for product " + productId + ": ", error);
                        });

                    promises.push(promise);
                });

                // Ждем завершения всех промисов и разрешаем промис getHistory()
                Promise.all(promises)
                    .then(() => resolve(firstImages))
                    .catch(error => reject(error));
            })
            .catch(function(error) {
                console.error("Error fetching purchase history: ", error);
                reject(error);
            });
    });
}

function getFavorites() {
    return new Promise((resolve, reject) => {
        var currentUser = localStorage.getItem('currentUser');

        // Проверяем, вошел ли пользователь на сайт
        if (currentUser) {
            // Если пользователь вошел, используем данные из Firebase
            var favoritesRef = database.ref('accounts/' + currentUser + '/favourites');
            fetchFavorites(favoritesRef, resolve, reject);
        } else {
            // Если пользователь не вошел, используем данные из куки
            var cookieData = Cookies.getJSON('userInfo');
            if (!cookieData || !cookieData.favourite) {
                // Если в куки нет данных об избранных товарах, создаем пустой объект и сохраняем его в куки
                cookieData = { favourite: {} };
                Cookies.set('userInfo', cookieData);
            }
            if (cookieData && cookieData.favourite) {
                // Если в куки есть данные об избранных товарах, создаем объект сразу
                var firstImages = {};
                var promises = [];
                for (const productId in cookieData.favourite) {
                    if (cookieData.favourite.hasOwnProperty(productId)) {
                        var imagesRef = database.ref('prostavki/' + productId + '/images');
                        var promise = imagesRef.once('value')
                            .then(function(imagesSnapshot) {
                                var firstImage = null;
                                imagesSnapshot.forEach(function(imageChildSnapshot) {
                                    if (!firstImage) {
                                        firstImage = imageChildSnapshot.val();
                                    }
                                });
                                if (firstImage) {
                                    firstImages[productId] = firstImage;
                                }
                            })
                            .catch(function(error) {
                                console.error("Error fetching first image for product " + productId + ": ", error);
                            });
                        promises.push(promise);
                    }
                }
                // Ждем завершения всех промисов и разрешаем промис getFavorites()
                Promise.all(promises)
                    .then(() => resolve(firstImages))
                    .catch(error => reject(error));
            } else {
                reject("User data not found");
            }
        }
    });
}

function fetchFavorites(favoritesRef, resolve, reject) {
    var firstImages = {};
    favoritesRef.once('value')
        .then(function(snapshot) {
            var promises = [];
            snapshot.forEach(function(childSnapshot) {
                var productId = childSnapshot.key;
                var imagesRef = database.ref('prostavki/' + productId + '/images');
                var promise = imagesRef.once('value')
                    .then(function(imagesSnapshot) {
                        var firstImage = null;
                        imagesSnapshot.forEach(function(imageChildSnapshot) {
                            if (!firstImage) {
                                firstImage = imageChildSnapshot.val();
                            }
                        });
                        if (firstImage) {
                            firstImages[productId] = firstImage;
                        }
                    })
                    .catch(function(error) {
                        console.error("Error fetching first image for product " + productId + ": ", error);
                    });
                promises.push(promise);
            });
            Promise.all(promises)
                .then(() => resolve(firstImages))
                .catch(error => reject(error));
        })
        .catch(function(error) {
            console.error("Error fetching favorites: ", error);
            reject(error);
        });
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

export { updateAllInfoProfile, updateCartInfoProfile, getUserInform, getMainInfo, getHistory, getFavorites };
