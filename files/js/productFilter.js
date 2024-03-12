
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

window.addEventListener('DOMContentLoaded', function() {

    const firebaseConfig = {
        apiKey: "AIzaSyBksjnCLyWqL4004kCtrpjzt6mZzl3mk5E",
        authDomain: "avtoprostavki-1337.firebaseapp.com",
        databaseURL: "https://avtoprostavki-1337-default-rtdb.firebaseio.com",
        projectId: "avtoprostavki-1337",
        storageBucket: "avtoprostavki-1337.appspot.com",
        messagingSenderId: "580863358064",
        appId: "1:580863358064:web:133ed9c449a5338601b0b5",
        measurementId: "G-SL7W9G5G4E"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    firebase.initializeApp(firebaseConfig);
    let database = firebase.database();
    let prostavkiRef = database.ref('prostavki');

    const db = getDatabase();

    // function showProducts(){
        
    //     // Ищем элемент с классом product_list внутри контейнера body
    //     let productContainer = document.querySelector('.product_list');
        
    //     prostavkiRef.once('value')
    //     .then(function(snapshot) {
    //     snapshot.forEach(function(childSnapshot) {
    //         var prostavkaData = childSnapshot.val();
    //         var description = prostavkaData.description;
    //         var productId = childSnapshot.key; // Получаем ID продукта
    //         var price = prostavkaData.price;
    //         var imageUrl = prostavkaData.images["1"];

    //         // Создаем элемент карточки
    //         var productItem = document.createElement('a');
    //         productItem.href = "";
    //         productItem.classList.add("product_item", "product-item"); // Добавляем класс product-item
    //         productItem.dataset.productId = productId; // Добавляем атрибут data-product-id с ID продукта

    //         // Создаем элемент для изображения
    //         var productItemImg = document.createElement('div');
    //         productItemImg.classList.add("product_item_img");

    //         // Создаем изображение для избранного
    //         var heartImg = document.createElement('img');
    //         heartImg.classList.add("product_item_img_tofavourite");
    //         heartImg.src = "/files/images/other/heart_notfill.png";
    //         heartImg.alt = "";

    //         // Создаем изображение товара
    //         var productImg = document.createElement('img');
    //         productImg.classList.add("product_item_img_cont");
    //         productImg.src = imageUrl;
    //         productImg.alt = "";

    //         // Добавляем изображения в элемент карточки
    //         productItemImg.appendChild(heartImg);
    //         productItemImg.appendChild(productImg);

    //         // Создаем элемент описания
    //         var productItemDesc = document.createElement('div');
    //         productItemDesc.classList.add("product_item_desc");

    //         // Создаем параграф для описания
    //         var descriptionParagraph = document.createElement('p');
    //         descriptionParagraph.textContent = description;

    //         // Создаем элемент для цены
    //         var productItemPrice = document.createElement('div');
    //         productItemPrice.classList.add("product_item_price");

    //         // Добавляем цену
    //         productItemPrice.textContent = price + " руб/ком.";

    //         // Создаем элемент кнопки
    //         var productItemBtn = document.createElement('div');
    //         productItemBtn.classList.add("product_item_btn");

    //         // Создаем изображение для кнопки
    //         var buyImg = document.createElement('img');
    //         buyImg.src = "/files/images/other/buy.png";
    //         buyImg.alt = "";

    //         // Добавляем кнопку
    //         productItemBtn.appendChild(buyImg);
    //         productItemBtn.appendChild(document.createTextNode("Купить"));

    //         // Добавляем элементы описания в элемент карточки
    //         productItemDesc.appendChild(descriptionParagraph);
    //         productItemDesc.appendChild(productItemPrice);
    //         productItemPrice.appendChild(productItemBtn);

    //         // Добавляем изображения и описание в элемент карточки
    //         productItem.appendChild(productItemImg);
    //         productItem.appendChild(productItemDesc);




            // productItem.addEventListener('click', function(event) {
            // if (event.target.classList.contains('product_item_img_tofavourite')) {
            //     event.preventDefault(); // Предотвращаем переход по ссылке
            //     event.stopPropagation(); // Останавливаем всплытие события

            //     // Меняем иконку сердечка
            //     var heartImg = event.target;

            //     // Получаем ID продукта из атрибута data-product-id
            //     var selectedProductId = event.currentTarget.dataset.productId;

            //     // Проверяем, вошел ли пользователь
            //     var currentUser = localStorage.getItem('currentUser');

            //     if (currentUser) {
            //         // Получаем ссылку на базу данных для избранного пользователя
            //         var userFavoritesRef = database.ref('accounts/' + currentUser + '/favourites');

            //         // Проверяем, есть ли уже такой товар в избранном
            //         userFavoritesRef.child(selectedProductId).once('value')
            //             .then(function(snapshot) {
            //                 if (snapshot.exists()) {
            //                     // Товар уже в избранном, удаляем его
            //                     userFavoritesRef.child(selectedProductId).remove();
            //                     heartImg.src = '/files/images/other/heart_notfill.png';
            //                 } else {
            //                     // Товар не в избранном, добавляем его
            //                     userFavoritesRef.child(selectedProductId).set("1");
            //                     heartImg.src = '/files/images/other/heart_fill.png';
            //                 }
            //             })
            //             .catch(function(error) {
            //                 console.error("Error checking user favorites: ", error);
            //             });
            //     } 
            //     else {
                    
            //         // Получаем текущее значение объекта из куки
            //         var myObject = Cookies.getJSON('userInfo') || {};

            //         if (myObject.favourite && myObject.favourite[selectedProductId]) {
            //             // Товар уже в избранном, удаляем его
            //             delete myObject.favourite[selectedProductId];
            //             heartImg.src = '/files/images/other/heart_notfill.png';
            //         } else {
            //             // Товар не в избранном, добавляем его
            //             if (!myObject.favourite) {
            //                 myObject.favourite = {}; // Если объекта "favourite" нет, создаем пустой объект
            //             }
            //             myObject.favourite[selectedProductId] = 1; // Устанавливаем товар в избранное
            //             heartImg.src = '/files/images/other/heart_fill.png';
            //         }

            //         // Записываем обновленный объект обратно в куки
            //         Cookies.set('userInfo', myObject);

            //     }
            // }               
            // else if (event.target.classList.contains('product_item_btn')) {
            //     event.preventDefault(); // Предотвращаем переход по ссылке
            //     event.stopPropagation(); // Останавливаем всплытие события


            //     // Получаем ID продукта из атрибута data-product-id
            //     var selectedProductIdCart = event.currentTarget.dataset.productId;

            //     // Проверяем, вошел ли пользователь
            //     var currentUser = localStorage.getItem('currentUser');

            //     if (currentUser) {
            //         // Получаем ссылку на базу данных для избранного пользователя
            //         var userCartRef = database.ref('accounts/' + currentUser + '/cart');

            //         // Проверяем, есть ли уже такой товар в избранном
            //         userCartRef.child(selectedProductIdCart).once('value')
            //             .then(function(snapshot) {
            //                 userCartRef.child(selectedProductIdCart).set("1");
            //             })
            //             .catch(function(error) {
            //                 console.error("Error checking user favorites: ", error);
            //             });

            //     } else {
            //         // Получаем текущее значение объекта из куки
            //         var myObject = Cookies.getJSON('userInfo');
                    
            //         // Проверяем, есть ли уже объект в куки
            //         if (!myObject) {
            //             myObject = {}; // Если объекта нет, создаем пустой объект
            //         }
                    
            //         // Проверяем, есть ли уже объект "cart" в объекте myObject
            //         if (!myObject.cart) {
            //             myObject.cart = {}; // Если объекта "cart" нет, создаем пустой объект
            //         }
            //             // Добавляем товар в корзину
            //         var productId = selectedProductIdCart; // Замените "your_product_id" на реальный id товара
            //         myObject.cart[productId] = 1; // Если товара нет в корзине, устанавливаем его количество равным 1

            //         Cookies.set('userInfo', myObject);

            //     } 
            // }        
            // else {
            //     event.preventDefault();

            //     // Получаем ID продукта из атрибута data-product-id
            //     var selectedProductId = event.currentTarget.dataset.productId;

            //     // Сохраняем ID продукта в локальное хранилище
            //     localStorage.setItem('selectedProductId', selectedProductId);

            //     // Переадресация на страницу товара
            //     window.location.href = '/files/html/item.html';                  
            // }
            // });   

            // var currentUser = localStorage.getItem('currentUser');
            // // Проверяем, залогинен ли пользователь
            // if (currentUser) {
            //     var userFavoritesRef = database.ref('accounts/' + currentUser + '/favourites');
                
            //     userFavoritesRef.child(productId).once('value')
            //         .then(function(snapshot) {
            //             if (snapshot.exists()) {
            //                 heartImg.src = '/files/images/other/heart_fill.png';
            //             } else {
            //                 heartImg.src = '/files/images/other/heart_notfill.png';
            //             }
            //         })
            //         .catch(function(error) {
            //             console.error("Error checking user favorites: ", error);
            //         });
            // } 
            // else {
            //     // Получаем текущее значение объекта из куки
            //     var myObject = Cookies.getJSON('userInfo') || {};
                
            //     if (myObject.favourite && myObject.favourite[productId]) {
            //         // Если товар уже в избранном в куки, устанавливаем иконку сердечка как заполненную
            //         heartImg.src = '/files/images/other/heart_fill.png';
            //     } else {
            //         // Если товара нет в избранном в куки, устанавливаем иконку сердечка как не заполненную
            //         heartImg.src = '/files/images/other/heart_notfill.png';
            //     }
            // }
    //         // Добавляем элемент карточки в найденный контейнер
    //         productContainer.appendChild(productItem);
    //     });
    //     })
    //     .catch(function(error) {
    //     console.error("Error fetching data: ", error);
    //     });   
    // } 


    function showProducts(productsToShow) {
        let productContainer = document.querySelector('.product_list');
        productContainer.innerHTML = ''; // Очищаем контейнер перед отображением новых продуктов
    
        productsToShow.forEach(productId => {
            // Получаем данные о проставке по ее ID
            let prostavkiRef = database.ref('prostavki/' + productId);
            prostavkiRef.once('value')
                .then(function(snapshot) {
                    var prostavkaData = snapshot.val();
                    var description = prostavkaData.description;
                    var price = prostavkaData.price;
                    var imageUrl = prostavkaData.images["1"];
    
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
                    heartImg.src = "/files/images/other/heart_notfill.png";
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
    
                    // Создаем элемент кнопки "Купить"
                    var productItemBtn = document.createElement('div');
                    productItemBtn.classList.add("product_item_btn");
    
                    var buyImg = document.createElement('img');
                    buyImg.src = "/files/images/other/buy.png";
                    buyImg.alt = "";
    
                    productItemBtn.appendChild(buyImg);
                    productItemBtn.appendChild(document.createTextNode("Купить"));
    
                    // Добавляем обработчик события для кнопки "Купить"
                    productItemBtn.addEventListener('click', function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        // Ваша логика для обработки нажатия на кнопку "Купить"
                    });
    
                    // Добавляем элементы описания в элемент карточки
                    productItemDesc.appendChild(descriptionParagraph);
                    productItemDesc.appendChild(productItemPrice);
                    productItemPrice.appendChild(productItemBtn);
    
                    // Добавляем изображения и описание в элемент карточки
                    productItem.appendChild(productItemImg);
                    productItem.appendChild(productItemDesc);
    
                    // Добавляем обработчик события для кнопки "Добавить в избранное"
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
    

                    var currentUser = localStorage.getItem('currentUser');
                    // Проверяем, залогинен ли пользователь
                    if (currentUser) {
                        var userFavoritesRef = database.ref('accounts/' + currentUser + '/favourites');
                        
                        userFavoritesRef.child(productId).once('value')
                            .then(function(snapshot) {
                                if (snapshot.exists()) {
                                    heartImg.src = '/files/images/other/heart_fill.png';
                                } else {
                                    heartImg.src = '/files/images/other/heart_notfill.png';
                                }
                            })
                            .catch(function(error) {
                                console.error("Error checking user favorites: ", error);
                            });
                    } 
                    else {
                        // Получаем текущее значение объекта из куки
                        var myObject = Cookies.getJSON('userInfo') || {};
                        
                        if (myObject.favourite && myObject.favourite[productId]) {
                            // Если товар уже в избранном в куки, устанавливаем иконку сердечка как заполненную
                            heartImg.src = '/files/images/other/heart_fill.png';
                        } else {
                            // Если товара нет в избранном в куки, устанавливаем иконку сердечка как не заполненную
                            heartImg.src = '/files/images/other/heart_notfill.png';
                        }
                    }
                    productContainer.appendChild(productItem);
                })
                .catch(function(error) {
                    console.error("Error fetching data: ", error);
                });
        });
    }
    
    // showProducts([
    //     "pr1",
    //     "pr2",
    //     "prostavka2",
    //     "prostavka1"
    // ]);


    const carSelect = document.getElementById('car-select'); // Select element to clear
    const yearSelect = document.getElementById('year-select'); // Select element to clear

    let selectedBrand = ''; // Variable to store the selected brand
    let selectedModel = '';
    let selectedYear = '';

    // Function to fetch car brands from Firebase and populate the dropdown
    function populateCarBrands() {
        const brandsRef = ref(db, 'cars'); // Reference to the 'cars' table in the database

        get(brandsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const brandsData = snapshot.val(); // Extracting data from snapshot
                const brandSelect = document.getElementById('brand-select'); // Select element to populate

                // Clear existing options
                brandSelect.innerHTML = '';

                // Add default option
                const defaultOption = document.createElement('option');
                defaultOption.text = 'Марка автомобиля';
                brandSelect.add(defaultOption);

                // Add options for each brand
                for (const brand in brandsData) {
                    const option = document.createElement('option');
                    option.value = brand;
                    option.text = brandsData[brand].text; // Assuming 'text' holds the brand name
                    brandSelect.add(option);
                }
            } else {
                console.log('No data available');
            }
        }).catch((error) => {
            console.error('Error fetching car brands:', error);
        });
    }
    function populateCarModels(brand) {
        const modelsRef = ref(db, `cars/${brand}/models`); // Reference to models of the selected brand

        get(modelsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const modelsData = snapshot.val(); // Extracting data from snapshot
                const carSelect = document.getElementById('car-select'); // Select element to populate

                // Clear existing options
                carSelect.innerHTML = '';

                // Add default option
                const defaultOption = document.createElement('option');
                defaultOption.text = 'Модель автомобиля';
                carSelect.add(defaultOption);

                // Add options for each model
                for (const model in modelsData) {
                    const option = document.createElement('option');
                    option.value = model;
                    option.text = model; // Assuming the model name is the same as the key
                    carSelect.add(option);
                }
            } else {
                console.log('No models available for the selected brand');
            }
        }).catch((error) => {
            console.error('Error fetching car models:', error);
        });
    }
    function populateCarYears(brand, model) {
        const yearsRef = ref(db, `cars/${brand}/models/${model}`); // Reference to years of the selected model

        get(yearsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const yearsData = snapshot.val(); // Extracting data from snapshot
                const yearSelect = document.getElementById('year-select'); // Select element to populate

                // Clear existing options
                yearSelect.innerHTML = '';

                // Add default option
                const defaultOption = document.createElement('option');
                defaultOption.text = 'Год автомобиля';
                yearSelect.add(defaultOption);

                // Add options for each year
                for (const year in yearsData) {
                    const option = document.createElement('option');
                    option.value = year;
                    option.text = year; // Assuming the year is the same as the key
                    yearSelect.add(option);
                }
            } else {
                console.log('No years available for the selected model');
            }
        }).catch((error) => {
            console.error('Error fetching car years:', error);
        });
    }
    // Call the function to populate car brands when the page loads
    populateCarBrands();

    let massiveProductList = [] //Создали массив для хранения всех проставок для вывода
    
    async function getProductList(selectedBrand, selectedModel, selectedYear) {
        // Очищаем массив перед заполнением
        massiveProductList = [];
    
        // Получаем ссылку на выбранный бренд
        const brandRef = ref(db, `cars/${selectedBrand}/models`);
    
        try {
            const brandSnapshot = await get(brandRef);
            if (brandSnapshot.exists()) {
                const modelsData = brandSnapshot.val();
    
                if (selectedModel == undefined) {
                    // Перебираем каждую модель
                    for (const model in modelsData) {
                        const yearsData = modelsData[model];
                        // Перебираем каждый год модели
                        for (const year in yearsData) {
                            const prostavkiData = yearsData[year];
                            // Перебираем каждую проставку
                            for (const prostavka in prostavkiData) {
                                // Добавляем проставку в массив
                                if (!massiveProductList.includes(prostavka)){
                                    massiveProductList.push(prostavka);
                                }
                            }
                        }
                    } 
                } else if (selectedYear == undefined) {
                    // Перебираем года выбранной модели
                    const modelRef = ref(db, `cars/${selectedBrand}/models/${selectedModel}`);
                    const modelSnapshot = await get(modelRef);
                    if (modelSnapshot.exists()) {
                        const yearsData = modelSnapshot.val();
                        // Перебираем каждый год модели
                        for (const year in yearsData) {
                            const prostavkiData = yearsData[year];
                            // Перебираем каждую проставку
                            for (const prostavka in prostavkiData) {
                                // Добавляем проставку в массив
                                if (!massiveProductList.includes(prostavka)){
                                    massiveProductList.push(prostavka);
                                }
                            }
                        }
                    } else {
                        console.log('No years available for the selected model');
                    }
                } else {
                    // Получаем проставки выбранного года выбранной модели
                    const yearRef = ref(db, `cars/${selectedBrand}/models/${selectedModel}/${selectedYear}`);
                    const yearSnapshot = await get(yearRef);
                    if (yearSnapshot.exists()) {
                        const prostavkiData = yearSnapshot.val();
                        // Перебираем каждую проставку
                        for (const prostavka in prostavkiData) {
                            // Добавляем проставку в массив
                            if (!massiveProductList.includes(prostavka)){
                                massiveProductList.push(prostavka);
                            }
                        }
                    } else {
                        console.log('No prostavki available for the selected year');
                    }
                }
                // После получения всех проставок, обновляем список товаров
                return massiveProductList;
            } else {
                console.log('No models available for the selected brand');
            }
        } catch (error) {
            console.error('Error fetching car data:', error);
        }
    }
    
    
    
    // Функция для обновления списка товаров на основе массива massiveProductList
    
    // Event listener for changes in the brand dropdown
    document.getElementById('brand-select').addEventListener('change', function() {
        selectedBrand = this.value; // Обновляем выбранную марку
        selectedModel = ''; // Сбрасываем выбранную модель
        selectedYear = ''; // Сбрасываем выбранный год
        
        getProductList(selectedBrand).then(res => {
            showProducts(res);
        }); // Получаем список товаров для выбранной марки
        if (selectedBrand) {
            populateCarModels(selectedBrand); // Заполняем список моделей на основе выбранной марки
            clearCarYears(); // Очищаем список годов
            clearCarModel(); // Очищаем список моделей
        }
    });
    
    document.getElementById('car-select').addEventListener('change', function() {
        selectedModel = this.value; // Обновляем выбранную модель
        selectedYear = ''; // Сбрасываем выбранный год
        getProductList(selectedBrand, selectedModel).then(res => {
            showProducts(res);
        }); // Получаем список товаров для выбранной модели
        if (selectedBrand && selectedModel) {
            populateCarYears(selectedBrand, selectedModel); // Заполняем список годов на основе выбранной модели
            clearCarYears(); // Очищаем список годов
        }
    });
    
    document.getElementById('year-select').addEventListener('change', function() {
        selectedYear = this.value; // Обновляем выбранный год
        getProductList(selectedBrand, selectedModel, selectedYear).then(res => {
            showProducts(res);
        }); // Получаем список товаров для выбранного года
        // console.log(`Бренд: ${selectedBrand} Модель: ${selectedModel} Год выпуска: ${selectedYear} `)

    });

    // Function to clear car years dropdown
    function clearCarYears() {
        yearSelect.innerHTML = ''; // Clear existing options
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.text = 'Год автомобиля';
        yearSelect.add(defaultOption);
    }
    // Function to clear car years dropdown
    function clearCarModel() {
        carSelect.innerHTML = ''; // Clear existing options
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.text = 'Модель автомобиля';
        carSelect.add(defaultOption);
    }




    // Фильтр брендов
// document.querySelector('.filter-drop-list__tittle').addEventListener('click', function(){
//     document.querySelector('.filter__drop-list').classList.toggle('filter__drop-list_active');
//   })
  
  document.querySelector('.tittle-sort__by-price').addEventListener('click', function(){
    if (this.classList.contains('tittle-sort__by-price_bottom-top')) {
      this.classList.remove('tittle-sort__by-price_bottom-top');
      this.classList.add('tittle-sort__by-price_top-bottom');
    } else if (this.classList.contains('tittle-sort__by-price_top-bottom')) {
      this.classList.remove('tittle-sort__by-price_top-bottom');
      this.classList.add('tittle-sort__by-price_bottom-top');
    } else {
      this.classList.add('tittle-sort__by-price_bottom-top');
    }
  
    document.querySelector('.tittle-sort__by-novelty').classList.remove('tittle-sort__by-novelty_active');
  });
  
  document.querySelector('.tittle-sort__by-novelty').addEventListener('click', function(){
    document.querySelector('.tittle-sort__by-price').classList.remove('tittle-sort__by-price_bottom-top', 'tittle-sort__by-price_top-bottom');
  
    this.classList.add('tittle-sort__by-novelty_active');
  });


  document.querySelector(".switch-pages__btn").addEventListener('click', function(){
    alert(`number of lll${document.querySelector(".product_list").children.length}`)
  })
});