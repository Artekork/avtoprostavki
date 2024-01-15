window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product_item_img_tofavourite').forEach(element => {
        element.addEventListener('click', function(){
            event.preventDefault();
            alert('Тык на сердечко)')
        })
    });



    // document.querySelector('.product_list').addEventListener('click', function(event) {
    //     // Проверяем, был ли клик по элементу с классом product_item_img_tofavourite
    //     if (event.target.classList.contains('product_item_img_tofavourite')) {
    //         event.preventDefault();
    //         alert('Тык на сердечко)');
            
    //     }
    // });
})