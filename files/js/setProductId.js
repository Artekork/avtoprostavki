window.addEventListener('DOMContentLoaded', function() {
  // Проверяем наличие сохраненного ID в локальном хранилище
  const urlParams = new URLSearchParams(window.location.search);

  // Получаем значение параметра 'id'
  const selectedProductId = urlParams.get('id');

  
  if (selectedProductId) {
    //alert(selectedProductId);

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
  
    // firebase.initializeApp(firebaseConfig);

    
    var database = firebase.database();
    var prostavkiRef = database.ref('prostavki');

    // Используйте метод child() для получения ссылки на конкретный элемент
    var specificElementRef = prostavkiRef.child(selectedProductId);

    // Получаем данные для конкретного элемента
    specificElementRef.once('value')
      .then(function(snapshot) {
        var prostavkaData = snapshot.val();

        var tittle = prostavkaData.tittle;
        var price = prostavkaData.price;
        var desc = prostavkaData.description;

        var condition = prostavkaData.characteristics.condition;
        var material  = prostavkaData.characteristics.material;
        var thickness = prostavkaData.characteristics.thickness;
        var type       = prostavkaData.characteristics.type;
        // Создаем объект для хранения массивов моделей по маркам
        var modelsByBrand = {};
        

        // Перебираем дочерние элементы в characteristics.models
        for (var brand in prostavkaData.characteristics.models) {
          if (prostavkaData.characteristics.models.hasOwnProperty(brand)) {
            // Разбиваем строки на массивы и сохраняем в modelsByBrand
            modelsByBrand[brand] = prostavkaData.characteristics.models[brand].split(',').map(model => model.trim());
          }
        }
        var allModels = Object.values(modelsByBrand)
          .flat()
          .join(', ');
          modelsByBrand = allModels;
        if (prostavkaData.images) {
          // Создаем объект для хранения массива изображений
          var imagesArray = [];
    
          // Перебираем все дочерние элементы в узле images
          for (var key in prostavkaData.images) {
            if (prostavkaData.images.hasOwnProperty(key)) {
              imagesArray.push(prostavkaData.images[key]);
            }
          }
        }
        // Теперь у вас есть данные для элемента с известным именем

        // alert(tittle);
        // alert(price);
        // alert(desc);
        // alert(condition);
        // alert(material);
        // alert(thickness);
        // alert(type);
        // alert(modelsByBrand);
        // alert(imagesArray[0]);

        var slider1 = document.querySelector('.slider1');
        var slider2 = document.querySelector('.slider2');
        createSlider(slider1);
        createSlider(slider2);
        function createSlider(sliderEl){
          imagesArray.forEach(function(imageUrl) {
            var slide = document.createElement('div');
            slide.classList.add('swiper-slide');
  
            var image = document.createElement('img');
            image.src = imageUrl;
  
            slide.appendChild(image);
            sliderEl.appendChild(slide);
          });
        }

        document.querySelector('.item-text__desc').innerText = desc;
        document.querySelector('.contacts_info_price').innerText = price + ' руб/комплект';

        // Находим элемент списка
        var itemPropertiesDesc = document.querySelector('.item-properties__desc');

        // Очищаем содержимое элемента списка (если нужно)
        itemPropertiesDesc.innerHTML = '';




        // Создаем и добавляем элементы списка
        var properties = {
          "Материал": material,
          "Модель авто": modelsByBrand, // Объединяем модели через запятую
          "Тип по изготовителю": type,
          "Состояние": condition,
          "Толщина": thickness
        };

        for (var property in properties) {
          if (properties.hasOwnProperty(property)) {
            var li = document.createElement('li');
            li.innerHTML = '<b>' + property + ':</b> ' + properties[property];
            itemPropertiesDesc.appendChild(li);
          }
        }







        var currentUser = localStorage.getItem('currentUser');

        let cart_btn = document.querySelector('.cart-btn')
        let favourite_btn = document.querySelector('.favourite-btn')

        let cart_btn_m = document.querySelector('.cart-btn_mobile')
        let favourite_btn_m = document.querySelector('.favourite-btn_mobile')
        
        if (currentUser) {
          var userFavoritesRef = database.ref('accounts/' + currentUser + '/favourites');
          
          userFavoritesRef.child(selectedProductId).once('value')
              .then(function(snapshot) {
                  if (snapshot.exists()) {
                    favourite_btn.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Убрать из избранного';
                    favourite_btn_m.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Из избранного';
                  } else {
                    favourite_btn.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Добавить в избранное';
                    favourite_btn_m.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">В избранное';
                  }
              })
              .catch(function(error) {
                  console.error("Error checking user favorites: ", error);
              });


              var userCartRef = database.ref('accounts/' + currentUser + '/cart');
              
              userCartRef.child(selectedProductId).once('value')
                  .then(function(snapshot) {
                      if (snapshot.exists()) {
                        cart_btn.innerHTML = '<img src="/files/images/other/buy.png" alt="">Убрать из корзины';
                        cart_btn_m.innerHTML = '<img src="/files/images/other/buy.png" alt="">Из корзины';

                      } else {
                        cart_btn.innerHTML = '<img src="/files/images/other/buy.png" alt="">Добавить в корзину';
                        cart_btn_m.innerHTML = '<img src="/files/images/other/buy.png" alt="">В корзину';
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
            favourite_btn.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Убрать из избранного';
            favourite_btn_m.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Из избранного';

          } else {
            favourite_btn.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Добавить в избранное';
            favourite_btn_m.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">В избранное';

          }

          if (myObject.cart && myObject.cart[selectedProductId]) {
            cart_btn.innerHTML = '<img src="/files/images/other/buy.png" alt="">Убрать из корзины';
            cart_btn_m.innerHTML = '<img src="/files/images/other/buy.png" alt="">Из корзины';

          } else {
            cart_btn.innerHTML = '<img src="/files/images/other/buy.png" alt="">Добавить в корзину';
            cart_btn_m.innerHTML = '<img src="/files/images/other/buy.png" alt="">В корзину';
          }

          

        }


        document.querySelectorAll('.favourite-btn').forEach(elem => {
          elem.addEventListener("click", addToFav)
        })
        document.querySelectorAll('.cart-btn').forEach(elem => {
          elem.addEventListener("click", addToCart)
        })


        
        function addToFav(){
          if (currentUser) {
            // Получаем ссылку на базу данных для избранного пользователя
            var userFavoritesRef = database.ref('accounts/' + currentUser + '/favourites');

            // Проверяем, есть ли уже такой товар в избранном
            userFavoritesRef.child(selectedProductId).once('value')
            .then(function(snapshot) {
                if (snapshot.exists()) {
                    // Товар уже в избранном, удаляем его
                    userFavoritesRef.child(selectedProductId).remove();
                    favourite_btn.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Добавить в избранное';
                    favourite_btn_m.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">В избранное';
                    createToast("success", "Товар удалён из избранного!");
                  } else {
                    // Товар не в избранном, добавляем его
                    userFavoritesRef.child(selectedProductId).set("1");
                    
                    favourite_btn.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Убрать из избранного';
                    favourite_btn_m.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Из избранного';
                    createToast("success", "Товар добавлен в избранное!");
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
                favourite_btn.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Добавить в избранное';
                favourite_btn_m.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">В избранное';
                createToast("success", "Товар удалён из избранного!");
            
            } 
            else {
              // Товар не в избранном, добавляем его
              if (!myObject.favourite) {
                  myObject.favourite = {}; // Если объекта "favourite" нет, создаем пустой объект
              }
              myObject.favourite[selectedProductId] = 1; // Устанавливаем товар в избранное
              favourite_btn.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Убрать из избранного';
              favourite_btn_m.innerHTML = '<img src="/files/images/other/purple_heart.png" alt="">Из избранного';
              createToast("success", "Товар добавлен в избранное!");
          
            }

            // Записываем обновленный объект обратно в куки
            Cookies.set('userInfo', myObject);
          }
        }

        function addToCart(){
          if (currentUser) {
            // Получаем ссылку на базу данных для избранного пользователя
            var userCartRef = database.ref('accounts/' + currentUser + '/cart');

            // Проверяем, есть ли уже такой товар в корзине
            userCartRef.child(selectedProductId).once('value')
            .then(function(snapshot) {
                if (snapshot.exists()) {
                    // Товар уже в корзине, удаляем его
                    userCartRef.child(selectedProductId).remove();
                    cart_btn.innerHTML = '<img src="/files/images/other/buy.png" alt="">Добавить в корзину';
                    cart_btn_m.innerHTML = '<img src="/files/images/other/buy.png" alt="">В корзину';
                    createToast("success", "Товар удалён из корзины!");
                  } else {          

                    // Товар не в корзине, добавляем его
                    userCartRef.child(selectedProductId).set("1");
                    
                    cart_btn.innerHTML = '<img src="/files/images/other/buy.png" alt="">Убрать из корзины';
                    cart_btn_m.innerHTML = '<img src="/files/images/other/buy.png" alt="">Из корзины';
                    createToast("success", "Товар добавлен в корзину!");
                }
            })
            .catch(function(error) {
                console.error("Error checking user favorites: ", error);
            });
          } 
          else {
            
            // Получаем текущее значение объекта из куки
            var myObject = Cookies.getJSON('userInfo') || {};

            if (myObject.cart && myObject.cart[selectedProductId]) {
                // Товар уже в корзине, удаляем его
                delete myObject.cart[selectedProductId];
                cart_btn.innerHTML = '<img src="/files/images/other/buy.png" alt="">Добавить в корзину';
                cart_btn_m.innerHTML = '<img src="/files/images/other/buy.png" alt="">В корзину';
                createToast("success", "Товар удалён из корзины!");
            
            } 
            else {
              // Товар не в корзине, добавляем его
              if (!myObject.cart) {
                  myObject.cart = {}; // Если объекта "cart" нет, создаем пустой объект
              }
              myObject.cart[selectedProductId] = 1; // Устанавливаем товар в избранное
              cart_btn.innerHTML = '<img src="/files/images/other/buy.png" alt="">Убрать из корзины';
              cart_btn_m.innerHTML = '<img src="/files/images/other/buy.png" alt="">Из корзины';
              createToast("success", "Товар добавлен в корзину!");
          
            }

            // Записываем обновленный объект обратно в куки
            Cookies.set('userInfo', myObject);
          }
        }
      })
      .catch(function(error) {
        console.error('Что-то пошло не так: ', error);
      });



      this.document.querySelector('.contacts_info__call-btn').addEventListener('click', function(){
        document.querySelector('dialog').showModal();
        document.body.classList.add('dialog-opened');        
      })



    // localStorage.removeItem('selectedProductId');
  } else {
    alert("Упс... Что-то пошло не так((");
  }
});