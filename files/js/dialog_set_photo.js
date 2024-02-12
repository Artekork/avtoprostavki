import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getDatabase, ref as databaseRef, set, remove } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { getStorage, ref, ref as storageRef, deleteObject, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js";
document.addEventListener("DOMContentLoaded", function () {
    // Конфигурация Firebase для вашего веб-приложения
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

    // Инициализация Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const database = getDatabase(app);

    $(document).ready(function() {
        var preview = new Croppie($('#image-preview')[0], {
          viewport: {
            width:  300,
            height: 300,
            type: 'circle'
          },
          boundary: {
            width: 350,
            height: 350
          },
          enableResize: false,
          enableOrientation: true,
          enableExif: true,
          slider: true, // Показывать ползунок масштабирования
          sliderWidth: 20, // Устанавливаем ширину ползунка в 50 пикселей
        });
    
        $('#image-input').on('change', function(e) {
          var file = e.target.files[0];
          if (file) {
              var reader = new FileReader();
              reader.onload = function() {
                  var base64data = reader.result;
                  preview.bind({
                      url: base64data
                  });
              }
              reader.readAsDataURL(file);
          } else {
              console.error('Ошибка загрузки файла');
          }
      });
    
        $('#crop-btn').on('click', function() {
          preview.result('base64').then(function(result) {
            uploadImageToStorage(result);
          });
        });
    
        // Функция для загрузки изображения в Firebase Storage и сохранения URL в базе данных
        function uploadImageToStorage(imageData) {
          var currentUser = localStorage.getItem('currentUser');
          var storageRef = ref(storage, 'users-photos/' + currentUser + '/userImage.png');
          var metadata = {
            contentType: 'image/png'
          };
    
          uploadString(storageRef, imageData, 'data_url', metadata)
            .then(function(snapshot) {
              return getDownloadURL(snapshot.ref);
            })
            .then(function(downloadURL) {
              // Сохраняем downloadURL в базе данных
              const dbReference = databaseRef(database, 'accounts/' + currentUser + '/profileImg');
              set(dbReference, downloadURL)
                .then(() => {
                  // Успешно записали URL в базу данных
                  console.log('URL успешно записан в базу данных');
                  dialog.close();
                  body.classList.remove('dialog-photo_opened');

                  document.querySelectorAll('.user_pic').forEach(function(elem) {
                    elem.src = downloadURL;
                  });
                })
                .catch(error => {
                  console.error('Ошибка записи в базу данных:', error);
                });
            })
            .catch(function(error) {
              console.error('Ошибка загрузки изображения:', error);
            });
        }
      });

    var dialog = document.querySelector('.dialog-photo');
    var openButton = document.querySelector('.user-info-img__btn-load');
    var closeButton = document.querySelector('.close-sign-photo');
    var body = document.body;
    var fileInput = document.getElementById('image-input');

    // Открываем окно после выбора файла
    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            dialog.showModal();
            body.classList.add('dialog-photo_opened');
        }
    }); 

    // Скрываем окно
    closeButton.addEventListener('click', function () {
        dialog.close();
        body.classList.remove('dialog-photo_opened');
    });    

    dialog.addEventListener('click', function (event) {
        // Проверяем, был ли клик вне диалогового окна
        if (event.target === dialog) {
            dialog.close();
            body.classList.remove('dialog-photo_opened');
        }
    });


    document.querySelector(".user-info-img__btn-delete").addEventListener("click", function(){
      document.querySelectorAll('.user_pic').forEach(function(elem) {
        elem.src = "/files/images/other/user.png";
      });
      var currentUser = localStorage.getItem('currentUser');

      // Удаляем изображение из хранилища Firebase Storage
      var storageReference = storageRef(storage, 'users-photos/' + currentUser + '/userImage.png');
      deleteObject(storageReference)
          .then(() => {
              console.log('Изображение успешно удалено из хранилища');
          })
          .catch((error) => {
              console.error('Ошибка при удалении изображения из хранилища:', error);
          });

      // Удаляем ссылку на изображение из базы данных Firebase Realtime Database
      const dbRef = databaseRef(database, 'accounts/' + currentUser + '/profileImg');
      remove(dbRef)
          .then(() => {
              console.log('Ссылка на изображение успешно удалена из базы данных');
          })
          .catch((error) => {
              console.error('Ошибка при удалении ссылки на изображение из базы данных:', error);
          });
  });



});

