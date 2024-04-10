import { updateUserData, addOrder, addOrderUnlogin } from "../js/change-data.js";

var currentUser = localStorage.getItem('currentUser');
var database = firebase.database();
var userCartRef = currentUser ? database.ref('accounts/' + currentUser + '/cart') : null;
var cartListContainer = document.querySelector('.section-cart__list');


function rearrangeElements() {
    let screenWidth = window.innerWidth;
    let confirmOrder = document.querySelector('.section-cart__confirm-order');
    let container = document.querySelector('.section-cart__container');
    
    if (screenWidth < 430) {
        if (confirmOrder && container) {
            container.appendChild(confirmOrder);
        }
    } else {
        let takeOrder = document.querySelector('.section-cart__take-order');
        if (confirmOrder && takeOrder) {
            takeOrder.appendChild(confirmOrder);
        }
    }
}

// Вызовем функцию обработки при загрузке страницы
window.addEventListener('load', rearrangeElements);

// Вызовем функцию обработки при изменении размера окна
window.addEventListener('resize', rearrangeElements);

// Функция для обновления итоговой цены
function updateTotalPrice() {
    let productPrice = 0;
    let productPriceField= document.querySelector('.confirm-price__order-price_product');

    // let deliveryPrice = 0;
    // let deliveryPriceField= document.querySelector('.confirm-price__order-price_delivery');

    // let commissionPrice = 0;
    // let commissionPriceField= document.querySelector('.confirm-price__order-price_commission');

    let totalPrice = 0;
    let totalPriceField= document.querySelector('.section-cart__confirm-total-cost');






    var productItems = document.querySelectorAll('.section-cart__product');
    productItems.forEach(function(productItem) {
        var checkbox = productItem.querySelector('.cart-checkbox');
        var quantity = parseInt(productItem.querySelector('.section-cart_product-counter').textContent);
        var priceText = productItem.querySelector('.section-cart_product-price').textContent;
        var price = parseFloat(priceText.replace(/[^\d.]/g, '')); // Извлекаем число из текста цены
        price /= 100; // Преобразуем цену из копеек в рубли

        if (checkbox.checked) {
            productPrice += quantity * price;
        }
    });

    productPrice = productPrice.toFixed(2);
    productPriceField.textContent = productPrice + ' руб';

    // deliveryPrice = (productPrice * 0.015).toFixed(2);
    // deliveryPriceField.textContent = deliveryPrice + ' руб';

    // commissionPrice = (productPrice * 0.025).toFixed(2);
    // commissionPriceField.textContent = commissionPrice + ' руб';

    totalPrice = productPrice; // Преобразование значений в числа и сложение
    totalPriceField.textContent = totalPrice + ' руб'; // Присваивание значения с текстом к содержимому элемента

}

function updateMainCheckbox() {
    var productCheckboxes = document.querySelectorAll('.cart-checkbox');
    var mainCheckbox = document.getElementById('main-checkbox');
    var allChecked = true;

    productCheckboxes.forEach(function(checkbox) {
        if (!checkbox.checked) {
            allChecked = false;
        }
    });

    mainCheckbox.checked = allChecked;
}

function addToFavorites(productId) {
if (currentUser) {
    // Получаем ссылку на раздел избранного текущего пользователя
    var userFavoritesRef = database.ref('accounts/' + currentUser + '/favourites');

    // Проверяем, есть ли уже такой товар в избранном
    userFavoritesRef.child(productId).once('value', function(snapshot) {
    if (snapshot.exists()) {
        createToast("success", "Этот товар уже добавлен в избранное");
    } else {
        // Добавляем товар в избранное
        userFavoritesRef.child(productId).set("1", function(error) {
            if (error) {
                console.error("Error adding to favorites: ", error);
            } else {
                createToast("success", "Товар успешно добавлен в избранное");    }
        });
    }
    });
}
else{
    var myObject = Cookies.getJSON('userInfo') || {};
    myObject.favourite = myObject.favourite || {}; // Инициализируем favourite как объект, если он не существует
    myObject.favourite[productId] = 1; // Устанавливаем товар в избранное
    Cookies.set('userInfo', myObject);
    createToast("success", "Товар успешно добавлен в избранное");
}     

}

function removeFromCart(productId) {
if (currentUser) {
    // Получаем ссылку на раздел корзины текущего пользователя
    var userCartRef = database.ref('accounts/' + currentUser + '/cart');

    // Получаем элемент корзины по ID продукта
    var cartProduct = document.querySelector('#' + productId).closest('.section-cart__product');


    let cartData = {}; // Если пользователь вошел в систему, начальные данные корзины будут пустыми
    userCartRef.once('value')
    .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var productId = childSnapshot.key;
            var quantity = childSnapshot.val();
            cartData[productId] = quantity;
        });
    }) // для получения cartData
    .catch(function(error) {
        console.error("Error fetching cart data: ", error);
    });

    // Удаляем товар из корзины
    userCartRef.child(productId).remove()
        .then(function() {
            createToast("success", "Товар успешно удален из корзины");
            // Удаление элемента из DOM
            cartProduct.remove();
            updateTotalPrice(); // Обновляем итоговую цену
            updateMainCheckbox(); // Обновляем состояние главного чекбокса


            setRightElementsCart(cartData);            
        })
        .catch(function(error) {
            console.error("Error removing from cart: ", error);
        });
} else {
    // Получаем текущее значение объекта из куки
    var myObject = Cookies.getJSON('userInfo') || {};
    
    // Проверяем, есть ли товар в корзине в куки
    if (myObject.cart && myObject.cart[productId]) {
        delete myObject.cart[productId]; // Удаляем товар из корзины в куки
        Cookies.set('userInfo', myObject); // Обновляем куки
            createToast("success", "Товар успешно удален из корзины");
        // Удаление элемента из DOM (если нужно)
        var cartProduct = document.querySelector('#' + productId).closest('.section-cart__product');
        if (cartProduct) {
            cartProduct.remove();
            updateTotalPrice(); // Обновляем итоговую цену
            updateMainCheckbox(); // Обновляем состояние главного чекбокса
            setRightElementsCart(getCartFromCookies());

        }
    } else {
    }
}
}

function getCartFromCookies() {
var userInfoCookie = Cookies.get('userInfo');
if (userInfoCookie) {
    var userInfo = JSON.parse(userInfoCookie);
    return userInfo.cart;
}
return {};
}

function loadCart(){
    var cartData;

    if (currentUser) {
        cartData = {}; // Если пользователь вошел в систему, начальные данные корзины будут пустыми
        userCartRef.once('value')
            .then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var productId = childSnapshot.key;
                    var quantity = childSnapshot.val();
                    cartData[productId] = quantity;
                });
                displayCart(cartData); // Отображаем корзину на странице
                setRightElementsCart(cartData);
            })
            .catch(function(error) {
                console.error("Error fetching cart data: ", error);
            });
    } else {
        // Если пользователь не вошел в систему, загружаем корзину из куков
        cartData = getCartFromCookies();
        displayCart(cartData); // Отображаем корзину на странице
        setRightElementsCart(cartData);
    }
}

function setRightElementsCart(cartData) {
    try {
        let cartMessage = document.querySelector('.section-card-cart__message');
        let cartContainer = document.querySelector('.section-cart__container');
        
        if (cartData && Object.keys(cartData).length > 0) {
            cartContainer.style.display = 'block';
            cartMessage.style.display = 'none'; 
        } else {
            cartContainer.style.display = 'none'; 
            cartMessage.style.display = 'flex';
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}

function displayCart(cartData) {
    // Очищаем контейнер корзины перед добавлением товаров

    // Перебираем каждый элемент корзины
    if (cartData != null){
        Object.keys(cartData).forEach(function(productId) {
            let quantity = cartData[productId]; // Получаем количество товара
        
            // Получаем данные о продукте из базы данных
            let productRef = database.ref('prostavki/' + productId);
            productRef.once('value')
                .then(function(productSnapshot) {
                    let productData = productSnapshot.val();
                    let productID = productData.id; // Получаем значение поля id из данных узла продукта
        
                    // Создаем элемент корзины
                    let cartProduct = document.createElement('div');
                    cartProduct.classList.add('section-cart__product');
        
                    // Создаем чекбокс для товара
                    let checkboxContainer = document.createElement('label');
                    checkboxContainer.classList.add('checkbox-container');
                    let checkboxInput = document.createElement('input');
                    checkboxInput.type = 'checkbox';
                    checkboxInput.id = productId; // Используем ID продукта как ID чекбокса
                    checkboxInput.classList.add('cart-checkbox'); // Добавляем класс для чекбокса
                    let checkboxMark = document.createElement('div');
                    checkboxMark.classList.add('checkmark');
                    checkboxContainer.appendChild(checkboxInput);
                    checkboxContainer.appendChild(checkboxMark);
                    cartProduct.appendChild(checkboxContainer);
        
                    
                    
                    
                    
                    // Создаем контейнер для карточки товара
                    let productCardContainer = document.createElement('div');
                    productCardContainer.classList.add('section-cart_product-card');
                    cartProduct.appendChild(productCardContainer);
        
                    // Создаем контейнер для изображения товара
                    let productDescContainer = document.createElement('div');
                    productDescContainer.classList.add('section-cart_product-card-desc');
                    let productImageContainer = document.createElement('div');
                    productImageContainer.classList.add('section-cart_product-image');
                    let productImage = document.createElement('img');
                    productImage.src = productData.images["1"]; // Здесь будет URL изображения товара
                    productImage.alt = ''; // Здесь можно добавить альтернативный текст для изображения
                    productImageContainer.appendChild(productImage);
                    productDescContainer.appendChild(productImageContainer);
        
                    // Создаем контейнер для описания товара
                    let productDesc = document.createElement('div');
                    productDesc.classList.add('section-cart_product-desc');
                    let productDescTop = document.createElement('div');
                    productDescTop.classList.add('section-cart_product-desc-top');
                    productDescTop.textContent = productData.description; // Здесь будет описание товара
                    let productDescDown = document.createElement('div');
                    productDescDown.classList.add('section-cart_product-desc-down');
                    let productDescCode = document.createElement('div');
                    productDescCode.classList.add('section-cart_product-desc-code');
                    productDescCode.textContent = 'Код товара: ' + productID; // Здесь будет код товара из данных узла продукта
                    let productDescButtons = document.createElement('div');
                    productDescButtons.classList.add('section-cart_product-desc-buttons');
                    let productDescToFav = document.createElement('div');
                    productDescToFav.classList.add('section-cart_product-desc-to-fav');
                    productDescToFav.textContent = 'В избранное';
                    let productDescDelete = document.createElement('div');
                    productDescDelete.classList.add('section-cart_product-desc-delete');
                    productDescDelete.textContent = 'Удалить';
                    productDescButtons.appendChild(productDescToFav);
                    productDescButtons.appendChild(productDescDelete);
                    productDescDown.appendChild(productDescCode);
                    productDescDown.appendChild(productDescButtons);
                    productDesc.appendChild(productDescTop);
                    productDesc.appendChild(productDescDown);
                    productDescContainer.appendChild(productDesc);
        
                    // Добавляем обработчик события для кнопки "В избранное"
                    productDescToFav.addEventListener('click', function() {
                        addToFavorites(productId); // Вызываем функцию добавления в избранное с идентификатором товара
                    });
        
                    productDescDelete.addEventListener('click', function() {
                        removeFromCart(productId);
                    });
        
                    // Добавляем контейнер описания товара в контейнер карточки товара
                    productCardContainer.appendChild(productDescContainer);
        
                    // Создаем контейнер для счетчика товара
                    let productCountContainer = document.createElement('div');
                    productCountContainer.classList.add('section-cart_product-count');
                    let decreaseButton = document.createElement('img');
                    decreaseButton.classList.add('section-cart__btn-decrease'); // Добавляем класс для кнопки уменьшения
                    decreaseButton.src = '/files/images/other/-.png';
                    decreaseButton.alt = '';
                    let productCounter = document.createElement('span');
                    productCounter.classList.add('section-cart_product-counter');
                    productCounter.textContent = quantity; // Здесь будет количество товара
                    let increaseButton = document.createElement('img');
                    increaseButton.classList.add('section-cart__btn-increase'); // Добавляем класс для кнопки увеличения
                    increaseButton.src = '/files/images/other/+.png';
                    increaseButton.alt = '';
                    productCountContainer.appendChild(decreaseButton);
                    productCountContainer.appendChild(productCounter);
                    productCountContainer.appendChild(increaseButton);
                    productCardContainer.appendChild(productCountContainer);
        
                    // Обработчик для кнопки уменьшения счётчика товара
                    decreaseButton.addEventListener('click', function() {
                        if (quantity > 0) {
                            quantity--; // Уменьшаем количество товара
                            productCounter.textContent = quantity; // Обновляем отображение количества товара на странице
                            productCardCounter_M.innerHTML = quantity;

                            if (currentUser) {
                                // Если пользователь авторизирован, обновляем количество товара в базе данных
                                userCartRef.child(productId).set(quantity);
                            } else {
                                // Если пользователь не авторизирован, обновляем количество товара в куки
                                let myObject = Cookies.getJSON('userInfo') || {};
                                myObject.cart[productId] = quantity;
                                Cookies.set('userInfo', myObject);
                            }
        
                            updateTotalPrice(); // Обновляем итоговую цену
                        }
                    });
        
                    // Обработчик для кнопки увеличения счётчика товара
                    increaseButton.addEventListener('click', function() {
                        quantity++; // Увеличиваем количество товара
                        productCounter.textContent = quantity; // Обновляем отображение количества товара на странице
                        productCardCounter_M.innerHTML = quantity;

                        if (currentUser) {
                            // Если пользователь авторизирован, обновляем количество товара в базе данных
                            userCartRef.child(productId).set(quantity);
                        } else {
                            // Если пользователь не авторизирован, обновляем количество товара в куки
                            let myObject = Cookies.getJSON('userInfo') || {};
                            myObject.cart[productId] = quantity;
                            Cookies.set('userInfo', myObject);
                        }
        
                        updateTotalPrice(); // Обновляем итоговую цену
                    });
        
                    // Создаем контейнер для цены товара
                    let productPriceContainer = document.createElement('div');
                    productPriceContainer.classList.add('section-cart_product-price');
                    productPriceContainer.textContent = productData.price + " руб"; // Здесь будет цена товара
                    productCardContainer.appendChild(productPriceContainer);
        
                    // Добавляем товар в контейнер корзины
                    cartListContainer.appendChild(cartProduct);

                    
                    // Создаем контейнер для второй карточки товара
                    let productCardContainer_M = document.createElement('div');
                    productCardContainer_M.classList.add('section-cart_product-card', 'section-cart_product-card_mobile');
                    cartProduct.appendChild(productCardContainer_M);

                        // Создаем контейнер для описания товара
                        let productCardDesc_M = document.createElement('div');
                        productCardDesc_M.classList.add('section-cart_product-card-desc');
                        productCardContainer_M.appendChild(productCardDesc_M);
                            
                            // Создаем контейнер для изображения
                            let productCardImgCont_M = document.createElement('div');
                            productCardImgCont_M.classList.add('product-card-desc__img-container');
                            productCardDesc_M.appendChild(productCardImgCont_M);

                                let productImage_M = document.createElement('img');
                                productImage_M.src = productData.images["1"]; // Здесь будет URL изображения товара
                                productImage_M.classList.add('product-card-desc__img');
                                productCardImgCont_M.appendChild(productImage_M);
                                productCardDesc_M.appendChild(productCardImgCont_M);
                            
                            // Создаем контейнер для текста
                            let productCardTextCont_M = document.createElement('div');
                            productCardTextCont_M.classList.add('product-card-desc__text');
                            productCardDesc_M.appendChild(productCardTextCont_M);

                                // Создаем контейнер для описания
                                let productCardDescCont_M = document.createElement('div');
                                productCardDescCont_M.classList.add('product-card-text__desc');
                                productCardDescCont_M.innerHTML = productData.description;
                                productCardTextCont_M.appendChild(productCardDescCont_M);

                                // Создаем контейнер для цены и id
                                let productCardPriceCont_M = document.createElement('div');
                                productCardPriceCont_M.classList.add('product-card-text__price');
                                productCardTextCont_M.appendChild(productCardPriceCont_M);

                                    // Создаем контейнер для id 
                                    let productId_M = document.createElement('div')
                                    productId_M.classList.add('product-card-price__id')
                                    productId_M.innerHTML = 'Код товара: ' + productID;
                                    productCardPriceCont_M.appendChild(productId_M)

                                    // Создаем контейнер для цены
                                    let productPrice_M = document.createElement('div')
                                    productPrice_M.classList.add('section-cart_product-price')
                                    productPrice_M.innerHTML = productData.price + " руб";;
                                    productCardPriceCont_M.appendChild(productPrice_M)


                        // Создаем контейнер для кнопок
                        let productCardButtons_M = document.createElement('div');
                        productCardButtons_M.classList.add('section-cart_product-card__buttons');
                        productCardContainer_M.appendChild(productCardButtons_M);

                            
                            let productCardButtonFav_M = document.createElement('div');
                            productCardButtonFav_M.classList.add('product-card-buttons__fav');
                            productCardButtonFav_M.innerHTML = 'В избранное';
                            productCardButtons_M.appendChild(productCardButtonFav_M);
                                
                            let productCardButtonCart_M = document.createElement('div');
                            productCardButtonCart_M.classList.add('product-card-buttons__delete');
                            productCardButtonCart_M.innerHTML = 'Удалить';
                            productCardButtons_M.appendChild(productCardButtonCart_M);
                                
                            let productCardButtonCounter_M = document.createElement('div');
                            productCardButtonCounter_M.classList.add('product-card-buttons__counter');
                            productCardButtons_M.appendChild(productCardButtonCounter_M);

                                let productCardCounterDec_M = document.createElement('img');
                                productCardCounterDec_M.classList.add('section-cart__btn-decrease');
                                productCardCounterDec_M.src = '/files/images/other/-.png'; // Здесь будет URL изображения товара
                                productCardButtonCounter_M.appendChild(productCardCounterDec_M);

                                let productCardCounter_M = document.createElement('span');
                                productCardCounter_M.classList.add('section-cart_product-counter');
                                productCardCounter_M.innerHTML = quantity;
                                productCardButtonCounter_M.appendChild(productCardCounter_M);
                                
                                let productCardCounterInc_M = document.createElement('img');
                                productCardCounterInc_M.classList.add('section-cart__btn-increase');
                                productCardCounterInc_M.src = '/files/images/other/+.png'; // Здесь будет URL изображения товара
                                productCardButtonCounter_M.appendChild(productCardCounterInc_M);
                                


                    productCardCounterDec_M.addEventListener('click', function() {
                        if (quantity > 0) {
                            quantity--; // Уменьшаем количество товара
                            productCounter.textContent = quantity; // Обновляем отображение количества товара на странице
                            productCardCounter_M.innerHTML = quantity;

                            if (currentUser) {
                                // Если пользователь авторизирован, обновляем количество товара в базе данных
                                userCartRef.child(productId).set(quantity);
                            } else {
                                // Если пользователь не авторизирован, обновляем количество товара в куки
                                let myObject = Cookies.getJSON('userInfo') || {};
                                myObject.cart[productId] = quantity;
                                Cookies.set('userInfo', myObject);
                            }
        
                            updateTotalPrice(); // Обновляем итоговую цену
                        }
                    });

                    // Обработчик для кнопки увеличения счётчика товара
                    productCardCounterInc_M.addEventListener('click', function() {
                        quantity++; // Увеличиваем количество товара
                        productCounter.textContent = quantity; // Обновляем отображение количества товара на странице
                        productCardCounter_M.innerHTML = quantity;

                        if (currentUser) {
                            // Если пользователь авторизирован, обновляем количество товара в базе данных
                            userCartRef.child(productId).set(quantity);
                        } else {
                            // Если пользователь не авторизирован, обновляем количество товара в куки
                            let myObject = Cookies.getJSON('userInfo') || {};
                            myObject.cart[productId] = quantity;
                            Cookies.set('userInfo', myObject);
                        }
        
                        updateTotalPrice(); // Обновляем итоговую цену
                    });

                    // Добавляем обработчик события для кнопки "В избранное"
                    productCardButtonFav_M.addEventListener('click', function() {
                        addToFavorites(productId); // Вызываем функцию добавления в избранное с идентификатором товара
                    });
        
                    productCardButtonCart_M.addEventListener('click', function() {
                        removeFromCart(productId);
                    });
                    
                })

            
            
            
                .catch(function(error) {
                    console.error("Error fetching product data: ", error);
                });
        });
    } else {
        alert("cardata = null")
    }
}

// Обновление итоговой цены при загрузке страницы
updateTotalPrice();

// Обработчик для главного чекбокса
var mainCheckbox = document.getElementById('main-checkbox');
mainCheckbox.addEventListener('change', function() {
    var productCheckboxes = document.querySelectorAll('.cart-checkbox');
    productCheckboxes.forEach(function(checkbox) {
        checkbox.checked = mainCheckbox.checked;
    });
    updateTotalPrice(); // Обновляем итоговую цену
});  

loadCart();

document.addEventListener('change', function(event) {
if (event.target.classList.contains('cart-checkbox')) {
    updateTotalPrice(); // Обновляем итоговую цену
    updateMainCheckbox(); // Обновляем состояние главного чекбокса

    
}
});

document.querySelector(".section-cart__confirm-btn").addEventListener("click", function(){
    let adres_cart = document.querySelector("#personal-data__adres").value;
    let name_cart = document.querySelector("#personal-data__name_cart").value;
    let surname_cart = document.querySelector("#personal-data__surname_cart").value;
    let otch_cart = document.querySelector("#personal-data__otch_cart").value;
    let mobile_cart = document.querySelector("#personal-data__tel_cart").value;
    let mail_cart = document.querySelector("#personal-data__mail_cart").value;

    let checkbox = document.querySelector('#checkbox_cart');

    let currentUser = localStorage.getItem('currentUser')

    let sectionToHide = document.querySelector('.section-cart__container');
    let sectionToShow = document.querySelector('.section-card__order-message');

    if (currentUser){
        if(validationCart() == true){
            if (checkbox.checked){
                updateUserData();
                addOrder()
                createToast("success", "Заказ оформлен");


                sectionToHide.style.display = 'none';
                sectionToShow.style.display = 'flex';
            } else{
                createToast("error", "Вы должны согласиться");
            }
        } else{
        // alert("Заполните необходимые поля для ввода")
        }
    } 
    else {
        if(validationCart() == true){     
            if (checkbox.checked){
                // Получаем текущие данные о пользователе из куки
                var existingUserData = Cookies.getJSON('userInfo') || {};
                // Объединяем текущие данные с новыми данными
                var userData = Object.assign(existingUserData, {
                    adres: adres_cart,
                    name: name_cart,
                    surname: surname_cart,
                    otch: otch_cart,
                    mobile: mobile_cart,
                    mail: mail_cart
                });

                // Сохраняем обновленные данные о пользователе в куки
                Cookies.set('userInfo', userData);

                // Добавляем заказ для незалогиненного пользователя
                addOrderUnlogin();
                sectionToHide.style.display = 'none';
                sectionToShow.style.display = 'flex';
                createToast("success", "Заказ оформлен");
            }   
            else{
                createToast("error", "Вы должны согласиться");
            }          
        } else{
            createToast("error", "Заполните необходимые поля для ввода");
        }
    }    
    function validateEmail(email) {
        var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return re.test(String(email).toLowerCase());
    }
    function validationCart(){
        if (adres_cart != "" && name_cart != "" && surname_cart != "" && mobile_cart.replace(/\D/g, '').length == 12) {
            document.querySelector("#personal-data__adres").style.outline = "none"
            document.querySelector("#cart-adres-alert").style.display = "none"
            document.querySelector("#personal-data__name_cart").style.outline = "none"
            document.querySelector("#cart-name-alert").style.display = "none"
            document.querySelector("#personal-data__surname_cart").style.outline = "none"
            document.querySelector("#cart-surname-alert").style.display = "none"
            document.querySelector("#personal-data__tel_cart").style.outline = "none"
            document.querySelector("#cart-phone-alert").style.display = "none"
            return true
        }
        else{

            // Прокручиваем страницу к элементу с id="exam"
            document.querySelector('.section-cart__adres-tittle').scrollIntoView({ 
                behavior: 'smooth'
            });
            if (adres_cart == ""){
                document.querySelector("#personal-data__adres").style.outline = "1px solid #FF2424"
                document.querySelector("#cart-adres-alert").style.display = "flex"
            }
            else {
                document.querySelector("#personal-data__adres").style.outline = "none"
                document.querySelector("#cart-adres-alert").style.display = "none"
            }
            if (name_cart == ""){
                document.querySelector("#personal-data__name_cart").style.outline = "1px solid #FF2424"
                document.querySelector("#cart-name-alert").style.display = "flex"
            }
            else {
                document.querySelector("#personal-data__name_cart").style.outline = "none"
                document.querySelector("#cart-name-alert").style.display = "none"
            }
            if (surname_cart == ""){
                document.querySelector("#personal-data__surname_cart").style.outline = "1px solid #FF2424"
                document.querySelector("#cart-surname-alert").style.display = "flex"
            }
            else {
                document.querySelector("#personal-data__surname_cart").style.outline = "none"
                document.querySelector("#cart-surname-alert").style.display = "none"
            }
            if (mobile_cart.replace(/\D/g, '').length != 12){
                document.querySelector("#personal-data__tel_cart").style.outline = "1px solid #FF2424"
                document.querySelector("#cart-phone-alert").style.display = "flex"
            }
            else {
                document.querySelector("#personal-data__tel_cart").style.outline = "none"
                document.querySelector("#cart-phone-alert").style.display = "none"
            }
            if (!validateEmail(mail_cart)){
                document.querySelector("#personal-data__mail_cart").style.outline = "1px solid #FF2424"
                document.querySelector("#cart-email-alert").style.display = "flex"
            }
            else {
                document.querySelector("#personal-data__mail_cart").style.outline = "none"
                document.querySelector("#cart-email-alert").style.display = "none"
            }
            return false
        }
    }
})











// Получаем все радиокнопки для доставки
const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
// Получаем все радиокнопки для оплаты
const paymentRadios = document.querySelectorAll('input[name="payment"]');

// Функция для обновления текста в соответствующих элементах
function updateText(event) {
  const selectedDelivery = document.querySelector('input[name="delivery"]:checked + label');
  const selectedPayment = document.querySelector('input[name="payment"]:checked + label');
  
  const deliveryMethodElement = document.querySelector('.order-delivery__method');
  const paymentMethodElement = document.querySelector('.order-payment__method');
  
  deliveryMethodElement.textContent = selectedDelivery.textContent.trim();
  paymentMethodElement.textContent = selectedPayment.textContent.trim();
}

// Привязываем обработчик события для каждой радиокнопки доставки
deliveryRadios.forEach(radio => {
  radio.addEventListener('change', updateText);
});

// Привязываем обработчик события для каждой радиокнопки оплаты
paymentRadios.forEach(radio => {
  radio.addEventListener('change', updateText);
});

// Вызываем функцию обновления текста, чтобы отобразить начальные значения
updateText();




































document.getElementById('personal-data__tel_cart').addEventListener('focus', function(){
    // Маска для ввода телефона
    var element = document.getElementById('personal-data__tel_cart');
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

    // Синхронизировать маску с начальным значением поля ввода
    mask.updateValue();
});

function updateCartList() {
    // Очищаем контейнер корзины перед добавлением товаров
    var cartProducts = document.querySelectorAll('.section-cart__list .section-cart__product');

    cartProducts.forEach(function(product) {
        product.remove();
    });

    var cartData;

    if (currentUser) {
        cartData = {}; // Если пользователь вошел в систему, начальные данные корзины будут пустыми
        userCartRef.once('value')
            .then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var productId = childSnapshot.key;
                    var quantity = childSnapshot.val();
                    cartData[productId] = quantity;
                });
                displayCart(cartData); // Отображаем корзину на странице
                setRightElementsCart(cartData);
            })
            .catch(function(error) {
                console.error("Error fetching cart data: ", error);
            });
    } else {
        // Если пользователь не вошел в систему, загружаем корзину из куков
        cartData = getCartFromCookies();
        displayCart(cartData); // Отображаем корзину на странице
        setRightElementsCart(cartData);

    }
}



export { updateCartList, updateMainCheckbox }