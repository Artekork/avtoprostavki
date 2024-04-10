import { updateFavouritesList  } from "../js/favourite-list.js";
import { updateCartList, updateMainCheckbox  } from "../js/cart-list.js";
// import { showHistoryProducts  } from "../js/purchase-history.js";
import { updateAllInfoProfile, getUserInform, updateCartInfoProfile, getHistory, getFavorites  } from "../js/getUserInfo.js";

let slider = document.querySelector(".slider");
let li = document.querySelectorAll(".top-bar__navigation ul li");
let contentSections = document.querySelectorAll(".profile-content");

let index_value = 0;
let left_position = 0;

li.forEach((item, index) => {
    slider.style.width = li[0].clientWidth + "px";
    slider.style.left = left_position + "px";

    item.onclick = function () {
        slider.style.width = item.clientWidth + "px";
        index_value = index;
        get_left_position();
        slider.style.left = left_position + "px";
        left_position = 0;

        // Удалить класс 'selected' у всех пунктов меню
        li.forEach(liItem => {
            liItem.classList.remove('selected');
        });

        // Добавить класс 'selected' к выбранному пункту меню
        item.classList.add('selected');

        // Отобразить соответствующий контент при выборе пункта меню
        showContent(index_value);
    }        
});
function get_left_position() {
    for (let i = 0; i < index_value; i++) {
        const element = li[i];
        left_position += element.clientWidth;
    }
}

function showContent(index) {
    // Скрыть все контентные разделы
    contentSections.forEach(section => {
        section.style.display = "none";
    });
    
    // Отобразить контентный раздел, соответствующий выбранному пункту меню
    let selectedSection = contentSections[index];
    if (selectedSection.classList.contains('section-menu-profile') || selectedSection.classList.contains('section-user-info')) {
        selectedSection.style.display = "flex";
    } else {
        selectedSection.style.display = "block";
    }
}

document.querySelector(".section-card-profile__change-data").onclick = function () {
    // Скрыть текущую секцию профиля
    let currentSection = document.querySelector(".section-menu-profile");
    currentSection.style.display = "none";

    // Переместить слайдер к соответствующему пункту меню
    let targetMenuItem = li[3];
    slider.style.width = targetMenuItem.clientWidth + "px";
    index_value = 3;
    get_left_position();
    slider.style.left = left_position + "px";
    left_position = 0;

    // Изменить цвет текста в необходимых местах
    // Например, можно изменить цвет текста у выбранного пункта меню на акцентный цвет,
    // а у остальных сделать обычный цвет
    li.forEach((item, index) => {
        if (index === index_value) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });

    // Отобразить соответствующий контент при выборе пункта меню
    showContent(index_value);
};

document.querySelector(".section-card-profile__history").onclick = function () {
    // Скрыть текущую секцию профиля
    let currentSection = document.querySelector(".section-menu-profile");
    currentSection.style.display = "none";

    // Переместить слайдер к соответствующему пункту меню
    let targetMenuItem = li[1];
    slider.style.width = targetMenuItem.clientWidth + "px";
    index_value = 1;
    get_left_position();
    slider.style.left = left_position + "px";
    left_position = 0;

    // Изменить цвет текста в необходимых местах
    li.forEach((item, index) => {
        if (index === index_value) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });

    // Отобразить соответствующий контент при выборе пункта меню
    showContent(index_value);
};



document.querySelector('.confirm-order-btn').addEventListener('click', function(){
    // Скрыть текущую секцию профиля
    let currentSection = document.querySelector(".section-menu-profile");
    currentSection.style.display = "none";

    // Переместить слайдер к соответствующему пункту меню
    let targetMenuItem = li[1];
    slider.style.width = targetMenuItem.clientWidth + "px";
    index_value = 1;
    get_left_position();
    slider.style.left = left_position + "px";
    left_position = 0;

    // Изменить цвет текста в необходимых местах
    li.forEach((item, index) => {
        if (index === index_value) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });

    // Отобразить соответствующий контент при выборе пункта меню
    showContent(index_value);

    let sectionToShow = document.querySelector('.section-card__order-message');

    sectionToShow.style.display = 'none';

})







document.querySelector(".section-card-profile__favourite").addEventListener('click', openFavourites)
document.querySelector(".bottom-nav__link-fav").addEventListener('click', openFavourites)
function openFavourites() {
    // Скрыть текущую секцию профиля
    let currentSection = document.querySelector(".section-menu-profile");
    currentSection.style.display = "none";

    // Переместить слайдер к соответствующему пункту меню
    let targetMenuItem = li[2];
    slider.style.width = targetMenuItem.clientWidth + "px";
    index_value = 2;
    get_left_position();
    slider.style.left = left_position + "px";
    left_position = 0;

    // Изменить цвет текста в необходимых местах
    li.forEach((item, index) => {
        if (index === index_value) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    document.querySelector('.bottom-nav__link-profile').classList.remove('bottom-nav__link-selected');
    document.querySelector('.bottom-nav__link-fav').classList.add('bottom-nav__link-selected');
    document.querySelector('.bottom-nav__link-cart').classList.remove('bottom-nav__link-selected');
    // Отобразить соответствующий контент при выборе пункта меню
    showContent(index_value);

}

document.querySelector(".bottom-nav__link-profile").addEventListener('click', openProfile)
function openProfile() {
    // Скрыть текущую секцию профиля
    let currentSection = document.querySelector(".section-menu-profile");
    currentSection.style.display = "none";

    // Переместить слайдер к соответствующему пункту меню
    let targetMenuItem = li[0];
    slider.style.width = targetMenuItem.clientWidth + "px";
    index_value = 0;
    get_left_position();
    slider.style.left = left_position + "px";
    left_position = 0;

    // Изменить цвет текста в необходимых местах
    li.forEach((item, index) => {
        if (index === index_value) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    document.querySelector('.bottom-nav__link-profile').classList.add('bottom-nav__link-selected');
    document.querySelector('.bottom-nav__link-fav').classList.remove('bottom-nav__link-selected');
    document.querySelector('.bottom-nav__link-cart').classList.remove('bottom-nav__link-selected');

    // Отобразить соответствующий контент при выборе пункта меню
    showContent(index_value);
}

document.querySelector(".bottom-nav__link-cart").addEventListener('click', openCart)
function openCart() {
    // Скрыть текущую секцию профиля
    let currentSection = document.querySelector(".section-menu-profile");
    currentSection.style.display = "none";

    // Переместить слайдер к соответствующему пункту меню
    let targetMenuItem = li[4];
    slider.style.width = targetMenuItem.clientWidth + "px";
    index_value = 4;
    get_left_position();
    slider.style.left = left_position + "px";
    left_position = 0;

    // Изменить цвет текста в необходимых местах
    li.forEach((item, index) => {
        if (index === index_value) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });

    document.querySelector('.bottom-nav__link-profile').classList.remove('bottom-nav__link-selected');
    document.querySelector('.bottom-nav__link-fav').classList.remove('bottom-nav__link-selected');
    document.querySelector('.bottom-nav__link-cart').classList.add('bottom-nav__link-selected');
    // Отобразить соответствующий контент при выборе пункта меню
    showContent(index_value);
}

function showHistory(){
    // alert(getHistory())
    document.querySelector('.section-card-history__items').innerHTML = "";
    getHistory().then(function(firstImages) {
      var historyItemsContainer = document.querySelector(".section-card-history__items");
      if (Object.keys(firstImages).length === 0) {
        let currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
        document.querySelector(".section-card-history__desc").textContent = "Вы ещё ничего не купили";
        } else{
        document.querySelector(".section-card-history__desc").textContent = "Для просмотра истории покупок войдите в аккаунт";
        }
      } 
      else {
        var totalPurchases = Object.keys(firstImages).length;

        document.querySelector(".section-card-history__desc").innerHTML = "Было куплено <b>" + totalPurchases+"</b> товара/ов";
        // Создаем элементы <a> с изображениями
        for (var productId in firstImages) {
            var imageSrc = firstImages[productId];
            var imageLink = document.createElement("a");
            imageLink.classList.add("section-card-history__item");
            //imageLink.href = ""; // Здесь можно добавить ссылку на страницу товара
            var imageElement = document.createElement("img");
            imageElement.src = imageSrc;
            imageElement.classList.add("section-card-history__img-item")
            imageElement.alt = ""; // Здесь можно добавить альтернативный текст для изображения
            imageLink.appendChild(imageElement);
            historyItemsContainer.appendChild(imageLink);
        }
      }
      }).catch(function(error) {
        console.error("Error fetching purchase history: ", error);
      }
    );
}

function showFavorites(){
    getFavorites().then(function(firstImages) {
        var favoritesItemsContainer = document.querySelector(".section-card-favourite__items");
        favoritesItemsContainer.innerHTML = "";
        
        if (Object.keys(firstImages).length === 0) {
            document.querySelector(".section-card-favourite__desc").innerHTML = "Здесь будут избранные товары <br>Чтобы добавить товар, нажмите: ❤" ;
        } else {
            // Очищаем контейнер избранных товаров перед добавлением новых

            var totalFavorites = Object.keys(firstImages).length;

            document.querySelector(".section-card-favourite__desc").innerHTML = "Избрано <b>" + totalFavorites + "</b> товара/ов";
            
            // Создаем элементы <a> с изображениями
            for (var productId in firstImages) {
                var imageSrc = firstImages[productId];
                var imageLink = document.createElement("a");
                imageLink.classList.add("section-card-product__item");
                //imageLink.href = ""; // Здесь можно добавить ссылку на страницу товара
                var imageElement = document.createElement("img");
                imageElement.src = imageSrc;
                imageElement.classList.add("section-card-product__img-item")
                imageElement.alt = ""; // Здесь можно добавить альтернативный текст для изображения
                imageLink.appendChild(imageElement);
                favoritesItemsContainer.appendChild(imageLink);
            }
        }
    }).catch(function(error) {
        console.error("Error fetching favorites: ", error);
    });
}

function showInfoCard(){
    if (getUserInform() != null){
        getUserInform().then(user => {
            if (user) {
                // Если пользователь зарегистрирован, обновляем информацию в соответствующих элементах HTML
                let userFullNameElement = document.querySelector('.section-card-profile__name');
                let userPhoneElement = document.querySelector('.section-card-profile__phone');
                
                document.querySelectorAll(".section-card-profile__button-login").forEach(element => {
                    element.style.display = "none";
                })
                document.querySelector(".section-card-profile__button-exit").style.display = "block" 
                document.querySelector(".section-card-profile__change-data").style.display = "block" 

                if (user.name) {
                    userFullNameElement.textContent = user.name;
                }
        
                if (user.mobile) {
                    userPhoneElement.textContent = user.mobile;
                } else {
                    userPhoneElement.textContent = "Заполните данные в личном кабинете";
                }
            } else {
                // Если пользователь не зарегистрирован, выводим соответствующее сообщение
                let userPhoneElement = document.querySelector('.section-card-profile__phone');
                userPhoneElement.textContent = "Для доступа к личным данным войдите в аккаунт";
            }
        }).catch(error => {
            console.error("Ошибка при получении информации о пользователе:", error);
        });
    }
}

function changeURL(URL){
    let url = window.location.href;
        let newUrl;

        // Проверяем, содержит ли URL уже параметр запроса
        if (url.indexOf('?') !== -1) {
            // Если есть параметр запроса, заменяем значение раздела на "cart"
            newUrl = url.replace(/section=[^&]+/, `section=${URL}`);
        } else {
            // Если параметра запроса еще нет, добавляем его
            newUrl = url + `?section=${URL}`;
        }

        // Обновляем URL без перенаправления на новую страницу
        window.history.replaceState({}, '', newUrl);
}

let isLoading = false;

document.querySelector(".section-profile").addEventListener("click", async function(){
    if (!isLoading) {
        isLoading = true;
        showFavorites();
        showInfoCard();
        showHistory();
        changeURL('profile')
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        isLoading = false;
    }
})

document.querySelector(".section-history").addEventListener("click", async function(){
    changeURL('history');    
})

document.querySelector(".section-favourite").addEventListener("click", async function(){
    if (!isLoading) {
        isLoading = true;
        updateFavouritesList();
        changeURL('favourite')
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        isLoading = false;
    }
})

document.querySelector(".section-user-info").addEventListener("click", async function(){
    if (!isLoading) {
        isLoading = true;
        updateAllInfoProfile();
        updateCartInfoProfile();
        changeURL('user-info')
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        isLoading = false;
    }
})

document.querySelector(".section-cart").addEventListener("click", async function(){
    if (!isLoading) {
        isLoading = true;
        updateCartList();
        updateMainCheckbox();
        changeURL('cart')
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        isLoading = false;
    }
})
document.querySelector(".bottom-nav__link-cart").addEventListener("click", async function(){
    if (!isLoading) {
        isLoading = true;
        updateCartList();
        updateMainCheckbox();
        changeURL('cart')
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        isLoading = false;
    }
})
// Обработчик события, который будет выполняться при загрузке страницы
window.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    

    // Определите, какой раздел должен быть показан по параметру 'section'
    let defaultSectionIndex;
    switch(section) {
        case 'profile':
            defaultSectionIndex = 0;
            document.querySelector('.bottom-nav__link-profile').classList.add('bottom-nav__link-selected');

            break;
        case 'history':
            defaultSectionIndex = 1;
            break;
        case 'favourite':
            defaultSectionIndex = 2;
            document.querySelector('.bottom-nav__link-fav').classList.add('bottom-nav__link-selected');

            break;
        case 'user-info':
            defaultSectionIndex = 3;
            break;
        case 'cart':
            defaultSectionIndex = 4;
            document.querySelector('.bottom-nav__link-cart').classList.add('bottom-nav__link-selected');

            break;
        default:
            defaultSectionIndex = 0; // Если параметр 'section' не определен или некорректен, показываем первый раздел по умолчанию
    }

    // Показать соответствующий раздел
    showContent(defaultSectionIndex);
    // Переместить слайдер к соответствующему пункту меню
    let targetMenuItem = li[defaultSectionIndex];
    slider.style.width = targetMenuItem.clientWidth + "px";
    index_value = defaultSectionIndex;
    get_left_position();
    slider.style.left = left_position + "px";
    left_position = 0;

    // Изменить цвет текста в необходимых местах
    li.forEach((item, index) => {
        if (index === index_value) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });

    
});

document.querySelectorAll('.section-card-profile__button-login').forEach(element => {
    element.addEventListener('click', function(event){
        event.preventDefault(); // Предотвращение стандартного поведения
        document.body.classList.add('dialog-sign-opened');   
    })
})
document.querySelector('.input-adres__button').addEventListener('click', function(){
    document.querySelector('.order-adres__location').innerHTML = document.querySelector('.personal-data__input-adres').value



    throw_message("Заказ выполнен успешно"); 
    return false;
    
})
function throw_message(str) {
    $('#error_message').html(str);
    $("#error_box").fadeIn(200).delay(1500).fadeOut(200);
}
export { showHistory, showFavorites, showInfoCard }