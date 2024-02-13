window.addEventListener('DOMContentLoaded', function() {
    // this.document.querySelector('.burger-button').addEventListener('click', function(){
    //     document.querySelector('.burger-panel').classList.toggle('burger-panel_is-active')
    // })

    // this.document.querySelector('.burger-panel__close-btn').addEventListener('click', function(){
    //     document.querySelector('.burger-panel').classList.toggle('burger-panel_is-active')
    //     consol.log('asd');
    // })
    // function testAlert() {
    //     alert("Hello world!");  
    // }



    

})

document.querySelector(".button1").addEventListener("click", function(){
    var myObject = { 
        name: "John", 
        age: 30 
    };
    Cookies.set('example', myObject);
    
})

document.querySelector(".button2").addEventListener("click", function(){
    document.querySelector(".text_block").textContent = ""
    updateText();
    var retrievedObject = Cookies.getJSON('example');
    
})

document.querySelector(".button3").addEventListener("click", function(){
    // Получаем текущее значение объекта из куки
    let myObject = Cookies.getJSON('example');
        
    // Проверяем, есть ли уже объект в куки
    if (!myObject) {
        myObject = {}; // Если объекта нет, создаем пустой объект
    }

    // Добавляем новые данные к объекту
    myObject = {
        surname: "Karavay"
    };

    // Записываем обновленный объект обратно в куки
    Cookies.set('example', myObject);
})



document.querySelector(".button4").addEventListener("click", function(){
    // Получаем текущее значение объекта из куки
    var myObject = Cookies.getJSON('example');
    
    // Проверяем, есть ли уже объект в куки
    if (!myObject) {
        myObject = {}; // Если объекта нет, создаем пустой объект
    }
    
    // Проверяем, есть ли уже объект "cart" в объекте myObject
    if (!myObject.cart) {
        myObject.cart = {}; // Если объекта "cart" нет, создаем пустой объект
    }
    
    // Добавляем товар в корзину
    var productId = "prostavka117228"; // Замените "your_product_id" на реальный id товара
    myObject.cart[productId] = 1; // Если товара нет в корзине, устанавливаем его количество равным 1
    myObject.test = "test"; // Если товара нет в корзине, устанавливаем его количество равным 1

    // Записываем обновленный объект обратно в куки
    Cookies.set('example', myObject);
})



document.querySelector(".button5").addEventListener("click", function(){
    // Получаем текущее значение объекта из куки
    var myObject = Cookies.getJSON('example');
    
    // Проверяем, есть ли уже объект в куки
    if (!myObject || !myObject.cart) {
        return; // Если объекта или корзины нет, выходим из функции
    }    
    var productId = "prostavka117228"; // Замените "your_product_id" на реальный id товара
    
    delete myObject.cart[productId];
    Cookies.set('example', myObject);
    
})

function updateText(){
    for (var key in retrievedObject) {
        if (retrievedObject.hasOwnProperty(key)) {
            document.querySelector(".text_block").innerHTML += key + ': ' + retrievedObject[key] + "<br>";
        }
      }
}