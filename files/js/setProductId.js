window.addEventListener('DOMContentLoaded', function() {
  // Проверяем наличие сохраненного ID в локальном хранилище
  var selectedProductId = localStorage.getItem('selectedProductId');

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
  
    firebase.initializeApp(firebaseConfig);

    
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

        // Перебираем массив imagesArray и создаем слайды для каждой ссылки
        



      })
      .catch(function(error) {
        console.error('Что-то пошло не так: ', error);
      });

    localStorage.removeItem('selectedProductId');
  } else {
    alert("Упс... Что-то пошло не так((");
  }
});