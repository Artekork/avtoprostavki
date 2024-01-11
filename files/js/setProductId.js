window.addEventListener('DOMContentLoaded', function() {
  // Проверяем наличие сохраненного ID в локальном хранилище
  var selectedProductId = localStorage.getItem('selectedProductId');

  if (selectedProductId) {
    alert(selectedProductId);

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

        var condition = prostavkaData.child(characteristics).condition;
        var material  = prostavkaData.characteristics.material;
        var thickness = prostavkaData.characteristics.thickness;
        var type       = prostavkaData.characteristics.type;
        // Создаем объект для хранения массивов моделей по маркам
        var modelsByBrand = {};

        // Перебираем дочерние элементы в characteristics.models
        for (var brand in characteristics.models) {
          if (characteristics.models.hasOwnProperty(brand)) {
            // Разбиваем строки на массивы и сохраняем в modelsByBrand
            modelsByBrand[brand] = characteristics.models[brand].split(',').map(model => model.trim());
          }
        }


        prostavkaData.images.once('value')
          .then(function(snapshot) {
            // Получаем значения из снимка
            var imagesData = snapshot.val();

            // Проверяем, есть ли данные в imagesData
            if (imagesData) {
              // Преобразуем объект значений в массив
              var imagesArray = Object.values(imagesData);

              // Теперь у вас есть массив изображений
              console.log(imagesArray);
            } else {
              console.log("Нет данных в узле 'images'.");
            }
          })
        // Теперь у вас есть данные для элемента с известным именем

        console.log(tittle);
        console.log(price);
        console.log(desc);
        console.log(condition);
        console.log(material);
        console.log(thickness);
        console.log(type);
        console.log(modelsByBrand);
        console.log(imagesArray);


      })
      .catch(function(error) {
        console.error('Что-то пошло не так: ', error);
      });

    localStorage.removeItem('selectedProductId');
  } else {
    alert("Упс... Что-то пошло не так((");
  }
});