import { updateUserData, addOrder, addOrderUnlogin } from "../js/change-data.js";

var currentUser = localStorage.getItem('currentUser');
var database = firebase.database();
var userCartRef = currentUser ? database.ref('accounts/' + currentUser + '/cart') : null;
var cartListContainer = document.querySelector('.section-cart__list');

// Функция для обновления итоговой цены
function updateTotalPrice() {
    var totalPrice = 0;
    var productItems = document.querySelectorAll('.section-cart__product');

    productItems.forEach(function(productItem) {
        var checkbox = productItem.querySelector('.cart-checkbox');
        var quantity = parseInt(productItem.querySelector('.section-cart_product-counter').textContent);
        var priceText = productItem.querySelector('.section-cart_product-price').textContent;
        var price = parseFloat(priceText.replace(/[^\d.]/g, '')); // Извлекаем число из текста цены
        price /= 100; // Преобразуем цену из копеек в рубли

        if (checkbox.checked) {
            totalPrice += quantity * price;
        }
    });

    document.querySelector('.section-cart__confirm-total-cost').textContent = totalPrice.toFixed(2) + ' руб';
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
        alert("Этот товар уже добавлен в избранное.");
    } else {
        // Добавляем товар в избранное
        userFavoritesRef.child(productId).set("1", function(error) {
            if (error) {
                console.error("Error adding to favorites: ", error);
            } else {
                alert("Товар успешно добавлен в избранное.");
            }
        });
    }
    });
}
else{
    var myObject = Cookies.getJSON('userInfo') || {};
    myObject.favourite = myObject.favourite || {}; // Инициализируем favourite как объект, если он не существует
    myObject.favourite[productId] = 1; // Устанавливаем товар в избранное
    Cookies.set('userInfo', myObject);
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
            alert("Товар успешно удален из корзины.");
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
        alert("Товар успешно удален из корзины.");
        // Удаление элемента из DOM (если нужно)
        var cartProduct = document.querySelector('#' + productId).closest('.section-cart__product');
        if (cartProduct) {
            cartProduct.remove();
            updateTotalPrice(); // Обновляем итоговую цену
            updateMainCheckbox(); // Обновляем состояние главного чекбокса
            setRightElementsCart(getCartFromCookies());

        }
    } else {
        alert("Такого товара нет в корзине.");
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
            })
            .catch(function(error) {
                console.error("Error fetching cart data: ", error);
            });
    } else {
        // Если пользователь не вошел в систему, загружаем корзину из куков
        cartData = getCartFromCookies();
        displayCart(cartData); // Отображаем корзину на странице
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
            var quantity = cartData[productId]; // Получаем количество товара
        
            // Получаем данные о продукте из базы данных
            var productRef = database.ref('prostavki/' + productId);
            productRef.once('value')
                .then(function(productSnapshot) {
                    var productData = productSnapshot.val();
                    var productID = productData.id; // Получаем значение поля id из данных узла продукта
        
                    // Создаем элемент корзины
                    var cartProduct = document.createElement('div');
                    cartProduct.classList.add('section-cart__product');
        
                    // Создаем чекбокс для товара
                    var checkboxContainer = document.createElement('label');
                    checkboxContainer.classList.add('checkbox-container');
                    var checkboxInput = document.createElement('input');
                    checkboxInput.type = 'checkbox';
                    checkboxInput.id = productId; // Используем ID продукта как ID чекбокса
                    checkboxInput.classList.add('cart-checkbox'); // Добавляем класс для чекбокса
                    var checkboxMark = document.createElement('div');
                    checkboxMark.classList.add('checkmark');
                    checkboxContainer.appendChild(checkboxInput);
                    checkboxContainer.appendChild(checkboxMark);
                    cartProduct.appendChild(checkboxContainer);
        
                    // Создаем контейнер для карточки товара
                    var productCardContainer = document.createElement('div');
                    productCardContainer.classList.add('section-cart_product-card');
                    cartProduct.appendChild(productCardContainer);
        
                    // Создаем контейнер для изображения товара
                    var productDescContainer = document.createElement('div');
                    productDescContainer.classList.add('section-cart_product-card-desc');
                    var productImageContainer = document.createElement('div');
                    productImageContainer.classList.add('section-cart_product-image');
                    var productImage = document.createElement('img');
                    productImage.src = productData.images["1"]; // Здесь будет URL изображения товара
                    productImage.alt = ''; // Здесь можно добавить альтернативный текст для изображения
                    productImageContainer.appendChild(productImage);
                    productDescContainer.appendChild(productImageContainer);
        
                    // Создаем контейнер для описания товара
                    var productDesc = document.createElement('div');
                    productDesc.classList.add('section-cart_product-desc');
                    var productDescTop = document.createElement('div');
                    productDescTop.classList.add('section-cart_product-desc-top');
                    productDescTop.textContent = productData.description; // Здесь будет описание товара
                    var productDescDown = document.createElement('div');
                    productDescDown.classList.add('section-cart_product-desc-down');
                    var productDescCode = document.createElement('div');
                    productDescCode.classList.add('section-cart_product-desc-code');
                    productDescCode.textContent = 'Код товара: ' + productID; // Здесь будет код товара из данных узла продукта
                    var productDescButtons = document.createElement('div');
                    productDescButtons.classList.add('section-cart_product-desc-buttons');
                    var productDescToFav = document.createElement('div');
                    productDescToFav.classList.add('section-cart_product-desc-to-fav');
                    productDescToFav.textContent = 'В избранное';
                    var productDescDelete = document.createElement('div');
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
                    var productCountContainer = document.createElement('div');
                    productCountContainer.classList.add('section-cart_product-count');
                    var decreaseButton = document.createElement('img');
                    decreaseButton.classList.add('section-cart__btn-decrease'); // Добавляем класс для кнопки уменьшения
                    decreaseButton.src = '/files/images/other/-.png';
                    decreaseButton.alt = '';
                    var productCounter = document.createElement('span');
                    productCounter.classList.add('section-cart_product-counter');
                    productCounter.textContent = quantity; // Здесь будет количество товара
                    var increaseButton = document.createElement('img');
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
        
                            if (currentUser) {
                                // Если пользователь авторизирован, обновляем количество товара в базе данных
                                userCartRef.child(productId).set(quantity);
                            } else {
                                // Если пользователь не авторизирован, обновляем количество товара в куки
                                var myObject = Cookies.getJSON('userInfo') || {};
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
        
                        if (currentUser) {
                            // Если пользователь авторизирован, обновляем количество товара в базе данных
                            userCartRef.child(productId).set(quantity);
                        } else {
                            // Если пользователь не авторизирован, обновляем количество товара в куки
                            var myObject = Cookies.getJSON('userInfo') || {};
                            myObject.cart[productId] = quantity;
                            Cookies.set('userInfo', myObject);
                        }
        
                        updateTotalPrice(); // Обновляем итоговую цену
                    });
        
                    // Создаем контейнер для цены товара
                    var productPriceContainer = document.createElement('div');
                    productPriceContainer.classList.add('section-cart_product-price');
                    productPriceContainer.textContent = productData.price + " руб"; // Здесь будет цена товара
                    productCardContainer.appendChild(productPriceContainer);
        
                    // Добавляем товар в контейнер корзины
                    cartListContainer.appendChild(cartProduct);
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

    let currentUser = localStorage.getItem('currentUser')

    if (currentUser){
        if(validationCart() == true){
        updateUserData();
        addOrder()
        alert("заказ оформлен");
        } else{
        // alert("Заполните необходимые поля для ввода")
        }
    } 
    else{
        if(validationCart() == true){          
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
        } else{
        alert("Заполните необходимые поля для ввода")
        }
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
            return false
        }
    }
})


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