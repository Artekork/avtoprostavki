var database = firebase.database();
var prostavkiRef = database.ref('prostavki');
var currentUser = localStorage.getItem('currentUser');
var userFavoritesRef = currentUser ? database.ref('accounts/' + currentUser + '/favourites') : null;


var favoriteProducts;
if (!currentUser) {
    favoriteProducts = getFavoritesFromCookie();
}

// Функция для получения избранных товаров из куки
function getFavoritesFromCookie() {
    var userInfoCookie = Cookies.get('userInfo');
    if (userInfoCookie) {
        var userInfo = JSON.parse(userInfoCookie);
        return userInfo.favourite;
    }
    return {};
}

// Функция для создания карточки товара
function createProductCard(productId, description, price, imageUrl) {
    // Создаем элемент карточки
    var productItem = document.createElement('a');
    productItem.href = "";
    productItem.classList.add("product_item", "product-item");
    productItem.dataset.productId = productId;

    // Создаем элемент для изображения
    var productItemImg = document.createElement('div');
    productItemImg.classList.add("product_item_img");

    // Создаем изображение для избранного
    var heartImg = document.createElement('img');
    heartImg.classList.add("product_item_img_tofavourite");
    heartImg.src = "/files/images/other/heart_fill.png"; // Изменено на заполненное сердце, так как товар находится в избранном
    heartImg.alt = "";

    // Создаем изображение товара
    var productImg = document.createElement('img');
    productImg.classList.add("product_item_img_cont");
    productImg.src = imageUrl;
    productImg.alt = "";

    // Добавляем изображения в элемент карточки
    productItemImg.appendChild(heartImg);
    productItemImg.appendChild(productImg);

    // Создаем элемент описания
    var productItemDesc = document.createElement('div');
    productItemDesc.classList.add("product_item_desc");

    // Создаем параграф для описания
    var descriptionParagraph = document.createElement('p');
    descriptionParagraph.textContent = description;

    // Создаем элемент для цены
    var productItemPrice = document.createElement('div');
    productItemPrice.classList.add("product_item_price");
    productItemPrice.textContent = price + " руб/ком.";

    // Создаем элемент кнопки
    var productItemBtn = document.createElement('div');
    productItemBtn.classList.add("product_item_btn");

    // Создаем изображение для кнопки
    var buyImg = document.createElement('img');
    buyImg.src = "/files/images/other/buy.png";
    buyImg.alt = "";

    // Добавляем кнопку
    productItemBtn.appendChild(buyImg);
    productItemBtn.appendChild(document.createTextNode("Купить"));

    // Добавляем элементы описания в элемент карточки
    productItemDesc.appendChild(descriptionParagraph);
    productItemDesc.appendChild(productItemPrice);
    productItemPrice.appendChild(productItemBtn);

    // Добавляем изображения и описание в элемент карточки
    productItem.appendChild(productItemImg);
    productItem.appendChild(productItemDesc);

    // Добавляем обработчик клика по карточке товара
    

    productItem.addEventListener('click', function(event) {
        if (event.target.classList.contains('product_item_img_tofavourite')) {
        event.preventDefault(); // Предотвращаем переход по ссылке
            event.stopPropagation(); // Останавливаем всплытие события

            // Меняем иконку сердечка
            var heartImg = event.target;

            // Получаем ID продукта из атрибута data-product-id
            var selectedProductId = event.currentTarget.dataset.productId;

            // Проверяем, вошел ли пользователь
            var currentUser = localStorage.getItem('currentUser');

            if (currentUser) {
                // Получаем ссылку на базу данных для избранного пользователя
                var userFavoritesRef = database.ref('accounts/' + currentUser + '/favourites');

                // Проверяем, есть ли уже такой товар в избранном
                userFavoritesRef.child(selectedProductId).once('value')
                    .then(function(snapshot) {
                        if (snapshot.exists()) {
                            // Товар уже в избранном, удаляем его
                            userFavoritesRef.child(selectedProductId).remove();
                            heartImg.src = '/files/images/other/heart_notfill.png';
                        } else {
                            // Товар не в избранном, добавляем его
                            userFavoritesRef.child(selectedProductId).set("1");
                            heartImg.src = '/files/images/other/heart_fill.png';
                        }
                    })
                    .catch(function(error) {
                        console.error("Error checking user favorites: ", error);
                    });
            } 
            else {
            
            // Получаем текущее значение объекта из куки
            var myObject = Cookies.getJSON('userInfo') || {};

            if (myObject.favourite && myObject.favourite[selectedProductId]) {
                // Товар уже в избранном, удаляем его
                delete myObject.favourite[selectedProductId];
                heartImg.src = '/files/images/other/heart_notfill.png';

                var productItem = event.target.closest('.product_item');
                productItem.remove();
            } else {
                // Товар не в избранном, добавляем его
                if (!myObject.favourite) {
                    myObject.favourite = {}; // Если объекта "favourite" нет, создаем пустой объект
                }
                myObject.favourite[selectedProductId] = 1; // Устанавливаем товар в избранное
                heartImg.src = '/files/images/other/heart_fill.png';
            }

            // Записываем обновленный объект обратно в куки
            Cookies.set('userInfo', myObject);

            }
        }               
        else if (event.target.classList.contains('product_item_btn')) {
        event.preventDefault(); // Предотвращаем переход по ссылке
            event.stopPropagation(); // Останавливаем всплытие события


            // Получаем ID продукта из атрибута data-product-id
            var selectedProductIdCart = event.currentTarget.dataset.productId;

            // Проверяем, вошел ли пользователь
            var currentUser = localStorage.getItem('currentUser');

            if (currentUser) {
                // Получаем ссылку на базу данных для избранного пользователя
                var userCartRef = database.ref('accounts/' + currentUser + '/cart');

                // Проверяем, есть ли уже такой товар в избранном
                userCartRef.child(selectedProductIdCart).once('value')
                    .then(function(snapshot) {
                    userCartRef.child(selectedProductIdCart).set("1");
                    })
                    .catch(function(error) {
                        console.error("Error checking user favorites: ", error);
                    });

            } else {
                // Получаем текущее значение объекта из куки
                var myObject = Cookies.getJSON('userInfo');
                
                // Проверяем, есть ли уже объект в куки
                if (!myObject) {
                    myObject = {}; // Если объекта нет, создаем пустой объект
                }
                
                // Проверяем, есть ли уже объект "cart" в объекте myObject
                if (!myObject.cart) {
                    myObject.cart = {}; // Если объекта "cart" нет, создаем пустой объект
                }
                // Добавляем товар в корзину
                var productId = selectedProductIdCart; // Замените "your_product_id" на реальный id товара
                myObject.cart[productId] = 1; // Если товара нет в корзине, устанавливаем его количество равным 1

                Cookies.set('userInfo', myObject);

            } 
        }        
        else {
        event.preventDefault();

        // Получаем ID продукта из атрибута data-product-id
        var selectedProductId = event.currentTarget.dataset.productId;

        // Сохраняем ID продукта в локальное хранилище
        localStorage.setItem('selectedProductId', selectedProductId);

        // Переадресация на страницу товара
        window.location.href = '/files/html/item.html';                  
        }
    });            


    // Добавляем карточку товара в блок избранных
    document.querySelector('.favourite-list').appendChild(productItem);
}

// Если пользователь вошел в систему, получаем список избранных товаров из базы данных
if (currentUser) {
    userFavoritesRef.once('value')
        .then(function (snapshot) {
            var favoriteProductIds = [];
            snapshot.forEach(function (childSnapshot) {
                favoriteProductIds.push(childSnapshot.key);
            });
            
            loadFavoriteProductsFromDatabase(favoriteProductIds);
        })
        .catch(function (error) {
            console.error("Error fetching user favorites: ", error);
        });
} 
else {
    // Если пользователь не вошел в систему, загружаем избранные товары из куки
    var favoriteProductIds = Object.keys(favoriteProducts);
    loadFavoriteProductsFromDatabase(favoriteProductIds);
}

// Функция для загрузки данных избранных товаров из базы данных и создания карточек
function loadFavoriteProductsFromDatabase(productIds) {
    return new Promise((resolve, reject) => {
        prostavkiRef.once('value')
            .then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var productId = childSnapshot.key;
                    if (productIds.includes(productId)) {
                        var prostavkaData = childSnapshot.val();
                        var description = prostavkaData.description;
                        var price = prostavkaData.price;
                        var imageUrl = prostavkaData.images["1"];
                        createProductCard(productId, description, price, imageUrl);
                    }
                });
                setRightElementsFavourite(productIds);
                resolve(); // Успешное завершение промиса
            })
            .catch(function(error) {
                reject(error); // Ошибка - отклоняем промис
            });
    });
}

function setRightElementsFavourite(productIds) {
    try {
        let favMessage = document.querySelector('.section-card-favourite__message');
        if (productIds.length > 0) {
            document.querySelector('.favourite-product_tittle').style.display = 'block';
            favMessage.style.display = 'none'; 
        } else {
            document.querySelector('.favourite-product_tittle').style.display = 'none';
            favMessage.style.display = 'flex';
        }
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
}


function updateFavouritesList(){
    // Очищаем текущий список избранных товаров
    var favouriteList = document.querySelector('.favourite-list');
    favouriteList.innerHTML = '';
    
    // Получаем список избранных товаров
    var currentUser = localStorage.getItem('currentUser');
    var userFavoritesRef = currentUser ? database.ref('accounts/' + currentUser + '/favourites') : null;
    var favoriteProducts;

    if (!currentUser) {
        favoriteProducts = getFavoritesFromCookie();
    }

    function loadFavoriteProducts(productIds) {
        return loadFavoriteProductsFromDatabase(productIds)
            .then(function() {
                console.log('Favorite products updated successfully');
            })
            .catch(function(error) {
                console.error("Error loading favorite products: ", error);
                throw error; // Re-throw the error to propagate it further
            });
    }

    if (currentUser) {
        userFavoritesRef.once('value')
            .then(function(snapshot) {
                var favoriteProductIds = [];
                snapshot.forEach(function(childSnapshot) {
                    favoriteProductIds.push(childSnapshot.key);
                });
                return loadFavoriteProducts(favoriteProductIds);
            })
            .catch(function(error) {
                console.error("Error fetching user favorites: ", error);
            });
    } else {
        var favoriteProductIds = Object.keys(favoriteProducts);
        loadFavoriteProducts(favoriteProductIds);
    }
}



export { updateFavouritesList }