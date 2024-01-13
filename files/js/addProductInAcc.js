document.querySelectorAll('.product_item').forEach(element => {
    element.addEventListener('click', function(event){
        if (event.target.classList.contains('product_item_img_tofavourite')) {
            // Предотвращаем стандартное действие (переход по ссылке)
            event.preventDefault();
            
            // Ваш код обработки клика
            alert('Тык на сердечко)');
        }
    });
});